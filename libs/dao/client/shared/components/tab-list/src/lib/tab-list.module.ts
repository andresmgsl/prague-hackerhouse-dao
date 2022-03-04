import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ApplicationTabModule } from '@dao-client/application-tab';
import { CollectionTabModule } from '@dao-client/collection-tab';
import { InstructionTabModule } from '@dao-client/instruction-tab';
import { ProfileTabModule } from '@dao-client/profile-tab';
import { StopPropagationModule } from '@dao-client/stop-propagation';
import { WorkspaceTabModule } from '@dao-client/workspace-tab';
import { TabListComponent } from './tab-list.component';

@NgModule({
  declarations: [TabListComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    WorkspaceTabModule,
    ApplicationTabModule,
    CollectionTabModule,
    InstructionTabModule,
    ProfileTabModule,
    StopPropagationModule,
  ],
  exports: [TabListComponent],
})
export class TabListModule {}
