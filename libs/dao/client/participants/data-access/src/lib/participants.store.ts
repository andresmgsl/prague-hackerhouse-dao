/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ProgramStore } from '@heavy-duty/ng-anchor';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { PublicKey } from '@solana/web3.js';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  defer,
  EMPTY,
  filter,
  from,
  switchMap,
} from 'rxjs';

interface ViewModel {
  participant: any;
}

const initialState: ViewModel = {
  participant: null,
};

@Injectable()
export class ParticipantsStore extends ComponentStore<ViewModel> {
  private readonly _reload = new BehaviorSubject(null);
  readonly reload$ = this._reload.asObservable();
  private readonly _reader$ = this._programStore.getReader('decidooor');
  readonly participant$ = this.select(({ participant }) => participant);

  constructor(
    private readonly _programStore: ProgramStore,
    private readonly _walletStore: WalletStore
  ) {
    super(initialState);
  }

  readonly loadParticipant = this.effect(() =>
    combineLatest([this._walletStore.publicKey$, this.reload$]).pipe(
      switchMap(([authority]) => {
        if (authority === null) {
          return EMPTY;
        }

        return this._reader$.pipe(
          filter((reader): reader is any => reader !== null),
          concatMap((reader) =>
            defer(() =>
              from(
                PublicKey.findProgramAddress(
                  [Buffer.from('participant', 'utf-8'), authority.toBuffer()],
                  reader.programId
                ).then(([participantPublicKey]) =>
                  reader.account['participant'].fetchNullable(
                    participantPublicKey
                  )
                )
              )
            ).pipe(
              tapResponse(
                (participant) =>
                  this.patchState({
                    participant,
                  }),
                (error) => console.log(error)
              )
            )
          )
        );
      })
    )
  );

  reload() {
    this.patchState({ participant: null });
    this._reload.next(null);
  }
}
