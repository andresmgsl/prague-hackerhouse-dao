import { Component } from '@angular/core';
import { ProjectsStore } from '@dao/client/projects/data-access';

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
            <h2 class="m-0 font-bold">{{ project.votes }}</h2>
            <div class="w-full"></div>
            <button mat-raised-button color="primary">Vote</button>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [],
  providers: [ProjectsStore],
})
export class ProjectsListComponent {
  readonly projects$ = this._projectsStore.projects$;

  constructor(private readonly _projectsStore: ProjectsStore) {}

  onReload() {
    this._projectsStore.reload();
  }
}
