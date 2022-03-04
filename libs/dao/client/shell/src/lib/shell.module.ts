import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { DarkThemeDirectiveModule } from '@dao-client/dark-theme';
import { DarkThemeSwitchModule } from '@dao-client/dark-theme-switch';
import { HdWalletAdapterMaterialModule } from '@heavy-duty/wallet-adapter-material';
import { ReactiveComponentModule } from '@ngrx/component';
import { ShellComponent } from './shell.component';

@NgModule({
  declarations: [ShellComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ShellComponent,
        children: [
          {
            path: '',
            loadChildren: () =>
              import(
                '@heavy-duty/dao/client/projects/components/projects-list'
              ).then((m) => m.ProjectsListModule),
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'projects',
      },
    ]),
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    ReactiveComponentModule,
    HdWalletAdapterMaterialModule,
    DarkThemeDirectiveModule,
    DarkThemeSwitchModule,
  ],
})
export class ShellModule {}
