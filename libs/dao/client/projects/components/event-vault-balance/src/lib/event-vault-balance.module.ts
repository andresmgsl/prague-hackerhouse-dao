import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EventVaultBalanceComponent } from './event-vault-balance.component';

@NgModule({
  imports: [CommonModule],
  declarations: [EventVaultBalanceComponent],
  exports: [EventVaultBalanceComponent],
})
export class EventVaultBalanceModule {}
