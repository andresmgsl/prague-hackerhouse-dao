/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ProgramStore } from '@heavy-duty/ng-anchor';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { getAccount } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import {
  BehaviorSubject,
  concatMap,
  defer,
  filter,
  from,
  switchMap,
} from 'rxjs';

const EVENT_ID = 'GQrfbmLq7ctktfofbR9DEJxM7GQ5YqTnoL1uLc1DT2hM';

interface ViewModel {
  event: any;
  eventState: any;
  eventVotes: any;
  eventVault: any;
}

const initialState: ViewModel = {
  event: null,
  eventState: null,
  eventVotes: null,
  eventVault: null,
};

@Injectable()
export class EventsStore extends ComponentStore<ViewModel> {
  private readonly _reload = new BehaviorSubject(null);
  readonly reload$ = this._reload.asObservable();
  private readonly _reader$ = this._programStore.getReader('decidooor');
  readonly event$ = this.select(({ event }) => event);
  readonly eventState$ = this.select(({ eventState }) => eventState);
  readonly eventVotes$ = this.select(({ eventVotes }) => eventVotes);

  constructor(private readonly _programStore: ProgramStore) {
    super(initialState);
  }

  readonly loadEvent = this.effect(() =>
    this.reload$.pipe(
      switchMap(() =>
        this._reader$.pipe(
          filter((reader): reader is any => reader !== null),
          concatMap((reader) =>
            defer(() =>
              from(reader.account['event'].fetch(new PublicKey(EVENT_ID)))
            ).pipe(
              tapResponse(
                (event) =>
                  this.patchState({
                    event,
                  }),
                (error) => console.log(error)
              )
            )
          )
        )
      )
    )
  );

  readonly loadEventState = this.effect(() =>
    this.reload$.pipe(
      switchMap(() =>
        this._reader$.pipe(
          filter((reader): reader is any => reader !== null),
          concatMap((reader) =>
            defer(() => {
              return from(
                PublicKey.findProgramAddress(
                  [
                    Buffer.from('event_state', 'utf-8'),
                    new PublicKey(EVENT_ID).toBuffer(),
                  ],
                  reader.programId
                ).then(([eventStatePublicKey]) =>
                  reader.account['eventState'].fetch(eventStatePublicKey)
                )
              );
            }).pipe(
              tapResponse(
                (eventState) =>
                  this.patchState({
                    eventState,
                  }),
                (error) => console.log(error)
              )
            )
          )
        )
      )
    )
  );

  readonly loadEventVotes = this.effect(() =>
    this.reload$.pipe(
      switchMap(() =>
        this._reader$.pipe(
          filter((reader): reader is any => reader !== null),
          concatMap((reader) =>
            defer(() => {
              return from(
                PublicKey.findProgramAddress(
                  [
                    Buffer.from('event_votes', 'utf-8'),
                    new PublicKey(EVENT_ID).toBuffer(),
                  ],
                  reader.programId
                ).then(([eventVotesPublicKey]) =>
                  reader.account['eventVotes'].fetch(eventVotesPublicKey)
                )
              );
            }).pipe(
              tapResponse(
                (eventVotes) =>
                  this.patchState({
                    eventVotes,
                  }),
                (error) => console.log(error)
              )
            )
          )
        )
      )
    )
  );

  readonly loadEventVault = this.effect(() =>
    this.reload$.pipe(
      switchMap(() =>
        this._reader$.pipe(
          filter((reader): reader is any => reader !== null),
          concatMap((reader) =>
            defer(() => {
              return from(
                PublicKey.findProgramAddress(
                  [
                    Buffer.from('event_vault', 'utf-8'),
                    new PublicKey(EVENT_ID).toBuffer(),
                  ],
                  reader.programId
                ).then(([eventVaultPublicKey]) =>
                  getAccount(reader.provider.connection, eventVaultPublicKey)
                )
              );
            }).pipe(
              tapResponse(
                (eventVault) =>
                  this.patchState({
                    eventVault,
                  }),
                (error) => console.log(error)
              )
            )
          )
        )
      )
    )
  );

  reload() {
    this.patchState({ event: null, eventState: null, eventVotes: null });
    this._reload.next(null);
  }
}
