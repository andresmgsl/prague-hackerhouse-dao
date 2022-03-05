import { Component } from '@angular/core';
import { EventsStore } from '@heavy-duty/dao/client/events/data-access';

@Component({
  selector: 'bd-event-vault-balance',
  template: `
    <div>
      <h1 class="display-4">Current Vault Balance: 100.000 USDC</h1>
    </div>
  `,
  styles: [],
})
export class EventVaultBalanceComponent {
  constructor(private readonly _eventStore: EventsStore) {
    this._eventStore.state$.subscribe((a) => console.log(a));
  }
}
