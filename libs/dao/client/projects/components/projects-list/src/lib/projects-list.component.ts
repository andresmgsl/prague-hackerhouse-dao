import { Component } from '@angular/core';
import { ProjectsStore } from '@dao/client/projects/data-access';
import { PublicKey } from '@solana/web3.js';

@Component({
  selector: 'bd-projects-list',
  template: `
    <bd-event-vault-balance></bd-event-vault-balance>
    <button mat-raised-button color="primary" (click)="onReload()" class="mb-4">
      Reload
    </button>
    <div class="flex flex-wrap justify-center">
      <div class="mr-5 mb-10 w-56" *ngFor="let project of projects$ | ngrxPush">
        <mat-card class="example-card">
          <mat-card-header>
            <mat-card-title
              >Project Name: {{ project.account.title }}</mat-card-title
            >
            <mat-card-subtitle
              >Author:
              {{
                project.account.authority.toBase58() | obscureAddress
              }}</mat-card-subtitle
            >
          </mat-card-header>
          <div class="w-full bg-black h-16"></div>
          <mat-card-content>
            <p>
              {{ project.account.description }}
            </p>
          </mat-card-content>
          <div class="flex items-center">
            <h2 class="m-0 font-bold">Votes: {{ project.votes }}</h2>
            <div class="w-full"></div>
            <div class="flex flex-col justify-center gap-2">
              <button
                mat-raised-button
                color="primary"
                (click)="onVote(project.publicKey)"
              >
                Vote
              </button>
              <button mat-raised-button color="accent">Redeem</button>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [],
  providers: [ProjectsStore],
})
export class ProjectsListComponent {
  readonly projects$ = this._projectsStore.fullProjects$;

  constructor(private readonly _projectsStore: ProjectsStore) {}

  onReload() {
    this._projectsStore.reload();
  }

  onVote(projectPublicKey: PublicKey) {
    this._projectsStore.voteForProject(projectPublicKey);
  }
}
