import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { PROGRAM_CONFIGS } from '@heavy-duty/ng-anchor';
import { HdWalletAdapterModule } from '@heavy-duty/wallet-adapter';
import * as decidooorIdl from '../assets/json/decidooor.json';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        {
          path: 'projects',
          loadChildren: () =>
            import('@dao/client/shell').then((m) => m.ShellModule),
        },
        {
          path: '**',
          redirectTo: 'projects',
        },
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
    HdWalletAdapterModule.forRoot({
      autoConnect: true,
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: PROGRAM_CONFIGS,
      useValue: {
        decidooor: {
          id: environment.decidooorId,
          idl: decidooorIdl,
        },
      },
    },
  ],
})
export class AppModule {}
