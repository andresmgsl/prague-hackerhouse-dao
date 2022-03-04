import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsListComponent } from './projects-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ProjectsListComponent },
    ]),
  ],
  declarations: [ProjectsListComponent],
  exports: [ProjectsListComponent],
})
export class ProjectsListModule {}
