import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { EventVaultBalanceModule } from '@dao/client/projects/components/event-vault-balance';
import { ReactiveComponentModule } from '@ngrx/component';
import { ProjectsListComponent } from './projects-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ProjectsListComponent },
    ]),
    EventVaultBalanceModule,
    ReactiveComponentModule,
    MatCardModule,
    MatButtonModule,
  ],
  declarations: [ProjectsListComponent],
  exports: [ProjectsListComponent],
})
export class ProjectsListModule {}
