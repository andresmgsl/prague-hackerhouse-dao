import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletStore } from '@heavy-duty/wallet-adapter';
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
        <hd-wallet-multi-button color="primary"></hd-wallet-multi-button>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent extends ComponentStore<object> implements OnInit {
  @HostBinding('class') class = 'block';

  constructor(
    private readonly _walletStore: WalletStore,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this._walletStore.connected$
      .pipe(filter((connected) => connected))
      .subscribe((resp) => console.log(resp));
  }
}
