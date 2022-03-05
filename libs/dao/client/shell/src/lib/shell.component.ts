import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsStore } from '@dao/client/projects/data-access';
import { EventsStore } from '@heavy-duty/dao/client/events/data-access';
import { ParticipantsStore } from '@heavy-duty/dao/client/participants/data-access';
import { ProgramStore } from '@heavy-duty/ng-anchor';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import { ComponentStore } from '@ngrx/component-store';
import { filter } from 'rxjs';

@Component({
  selector: 'bd-shell',
  template: `
    <div class="pt-10 pr-20 pl-20">
      <header class=" w-full flex justify-between mb-20">
        <div class="flex items-center">
          <img src="assets/images/logo.png" class="w-8" alt="DAO NAME LOGO" />
          <p class="m-0 ml-4">DAO Name</p>
        </div>
        <div class="flex items-center">
          <button
            mat-button
            color="primary"
            class="mr-5"
            bdCreateApplicationTrigger
            (aplicationCreated)="onApplicationCreated($event)"
          >
            Create project
          </button>
          <hd-wallet-multi-button color="primary"></hd-wallet-multi-button>
        </div>
      </header>
      <main>
        <p *ngIf="participant$ | ngrxPush">
          You're participating in the event.
        </p>
        <p *ngIf="eventState$ | ngrxPush as eventState">
          Event finishes at
          <b> {{ eventState.redeemDate.toNumber() * 1000 | date: 'medium' }}</b
          >.
        </p>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProgramStore, EventsStore, ProjectsStore, ParticipantsStore],
})
export class ShellComponent extends ComponentStore<object> implements OnInit {
  @HostBinding('class') class = 'block';
  readonly participant$ = this._participantsStore.participant$;
  readonly eventState$ = this._eventsStore.eventState$;

  constructor(
    private readonly _walletStore: WalletStore,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _connectionStore: ConnectionStore,
    private readonly _programStore: ProgramStore,
    private readonly _projectsStore: ProjectsStore,
    private readonly _eventsStore: EventsStore,
    private readonly _participantsStore: ParticipantsStore
  ) {
    super();
  }

  ngOnInit() {
    this._connectionStore.setEndpoint('http://localhost:8899');
    this._programStore.loadConnection(this._connectionStore.connection$);
    this._programStore.loadWallet(this._walletStore.anchorWallet$);

    this._walletStore.connected$
      .pipe(filter((connected) => connected))
      .subscribe();
  }

  onApplicationCreated(project: any) {
    this._projectsStore.createProject(project);
  }
}
