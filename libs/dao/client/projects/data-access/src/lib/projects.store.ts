/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { EventsStore } from '@heavy-duty/dao/client/events/data-access';
import { ProgramStore } from '@heavy-duty/ng-anchor';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Provider } from '@project-serum/anchor';
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  defer,
  EMPTY,
  filter,
  from,
  Observable,
  switchMap,
} from 'rxjs';

const EVENT_ID = 'GQrfbmLq7ctktfofbR9DEJxM7GQ5YqTnoL1uLc1DT2hM';
const ACCEPTED_MINT = 'AyJsiH6yQGL7BQfxuk7sgaKQH7NQ8kv6BekEMsqF7QGM';

interface ViewModel {
  projects: any;
}

const initialState: ViewModel = {
  projects: null,
};

export const createAssociatedTokenAccount = async (
  provider: Provider,
  mint: PublicKey
): Promise<PublicKey | undefined> => {
  const associatedTokenPublicKey = await getAssociatedTokenAddress(
    mint,
    provider.wallet.publicKey
  );
  let associatedTokenAccount;

  try {
    associatedTokenAccount = await getAccount(
      provider.connection,
      associatedTokenPublicKey
    );
  } catch (err) {
    console.log({ err });
  }

  if (associatedTokenAccount) {
    return associatedTokenPublicKey;
  }

  // Create a token account for the user and mint some tokens
  await provider.send(
    new Transaction().add(
      createAssociatedTokenAccountInstruction(
        provider.wallet.publicKey,
        associatedTokenPublicKey,
        provider.wallet.publicKey,
        mint
      )
    )
  );

  return associatedTokenPublicKey;
};

@Injectable()
export class ProjectsStore extends ComponentStore<ViewModel> {
  private readonly _reload = new BehaviorSubject(null);
  readonly reload$ = this._reload.asObservable();
  private readonly _reader$ = this._programStore.getReader('decidooor');
  private readonly _writer$ = this._programStore.getWriter('decidooor');
  readonly projects$ = this.select(({ projects }) => projects);
  readonly fullProjects$ = this.select(
    this.projects$,
    this._eventsStore.eventVotes$,
    (projects, eventVotes) =>
      projects &&
      eventVotes &&
      projects.map((project: any) => ({
        ...project,
        votes:
          eventVotes.votesStats
            .find((eventVote: any) =>
              eventVote.project.equals(project.publicKey)
            )
            ?.votes.toNumber() ?? 0,
      }))
  );

  constructor(
    private readonly _eventsStore: EventsStore,
    private readonly _walletStore: WalletStore,
    private readonly _programStore: ProgramStore
  ) {
    super(initialState);
  }

  readonly loadProjects = this.effect(() =>
    this.reload$.pipe(
      switchMap(() =>
        this._reader$.pipe(
          filter((reader): reader is any => reader !== null),
          concatMap((reader) =>
            defer(() =>
              from(
                reader.account['project'].all([
                  {
                    memcmp: {
                      offset: 40,
                      bytes: new PublicKey(EVENT_ID).toBase58(),
                    },
                  },
                ])
              )
            ).pipe(
              tapResponse(
                (projects) =>
                  this.patchState({
                    projects,
                  }),
                (error) => console.log(error)
              )
            )
          )
        )
      )
    )
  );

  readonly createProject = this.effect(
    ($: Observable<{ title: string; description: string }>) =>
      combineLatest([$, this._walletStore.publicKey$]).pipe(
        switchMap(([{ title, description }, authority]) => {
          if (authority === null) {
            return EMPTY;
          }

          return this._writer$.pipe(
            filter((writer): writer is any => writer !== null),
            concatMap((writer) =>
              defer(() => {
                const projectKeypair = Keypair.generate();
                return from(
                  createAssociatedTokenAccount(
                    writer.provider,
                    new PublicKey(ACCEPTED_MINT)
                  )
                    .then(async (associatedTokenPublicKey) => {
                      return {
                        associatedTokenPublicKey,
                        createProjectAccountIx:
                          await writer.account.project.createInstruction(
                            projectKeypair,
                            1000 // TODO: Change to the right size
                          ),
                      };
                    })
                    .then(
                      ({
                        associatedTokenPublicKey,
                        createProjectAccountIx,
                      }) => {
                        return writer.methods
                          .createProject({
                            title,
                            description,
                          })
                          .accounts({
                            authority,
                            event: new PublicKey(EVENT_ID),
                            project: projectKeypair.publicKey,
                            acceptedMint: new PublicKey(ACCEPTED_MINT),
                            projectVault: associatedTokenPublicKey,
                          })
                          .signers([projectKeypair])
                          .preInstructions([createProjectAccountIx])
                          .rpc();
                      }
                    )
                );
              }).pipe(
                tapResponse(
                  () => this.reload(),
                  (error) => console.log(error)
                )
              )
            )
          );
        })
      )
  );

  voteForProject = this.effect(($: Observable<PublicKey>) =>
    combineLatest([$, this._walletStore.publicKey$]).pipe(
      switchMap(([projectPublicKey, authority]) => {
        if (authority === null) {
          return EMPTY;
        }

        return this._writer$.pipe(
          filter((writer): writer is any => writer !== null),
          concatMap((writer) =>
            defer(() => {
              return from(
                writer.methods
                  .vote()
                  .accounts({
                    authority,
                    project: projectPublicKey,
                    event: new PublicKey(EVENT_ID),
                  })
                  .rpc()
              );
            }).pipe(
              tapResponse(
                () => this.reload(),
                (error) => console.log(error)
              )
            )
          )
        );
      })
    )
  );

  reload() {
    this.patchState({ projects: null });
    this._reload.next(null);
  }
}
