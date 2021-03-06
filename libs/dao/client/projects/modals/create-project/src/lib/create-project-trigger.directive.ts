import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectComponent } from './create-project.component';

@Directive({ selector: '[bdCreateApplicationTrigger]' })
export class CreateApplicationTriggerDirective {
  @Output() aplicationCreated = new EventEmitter<any>();
  @HostListener('click') onClick(): void {
    this._matDialog
      .open<CreateProjectComponent>(CreateProjectComponent)
      .afterClosed()
      .subscribe((data) => data && this.aplicationCreated.emit(data));
  }

  constructor(private readonly _matDialog: MatDialog) {}
}
