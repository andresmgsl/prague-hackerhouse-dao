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
    <header class="mt-5 flex justify-center flex-wrap">
      <h1 class="w-full text-center">DAO Prague HackerHouse - SHELL</h1>
      <p class="w-full text-center">Connect your wallet to vote</p>
    </header>
    <main class="flex justify-center">
      <hd-wallet-multi-button color="primary"></hd-wallet-multi-button>
    </main>
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
