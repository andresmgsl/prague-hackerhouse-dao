import { Component, HostBinding } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'bd-create-project',
  template: `
    <div>
      <h2>New project</h2>
      <div>
        <form
          [formGroup]="form"
          class="flex flex-col gap-4"
          (ngSubmit)="onCreateProject()"
        >
          <mat-form-field
            class="w-full mb-5"
            appearance="fill"
            hintLabel="Enter the project title."
          >
            <mat-label>Title</mat-label>
            <input
              matInput
              formControlName="title"
              required
              autocomplete="off"
              maxlength="32"
            />
            <mat-hint align="end"
              >{{ this.form.get('title')?.value?.length || 0 }}/32</mat-hint
            >

            <mat-error
              *ngIf="submitted && this.form.get('title')?.hasError('required')"
              >The title is mandatory.</mat-error
            >
            <mat-error
              *ngIf="submitted && this.form.get('title')?.hasError('maxlength')"
              >Maximum length is 32.</mat-error
            >
          </mat-form-field>

          <mat-form-field
            class="w-full mb-10"
            appearance="fill"
            hintLabel="Enter the project description."
          >
            <mat-label>Description</mat-label>
            <input
              matInput
              formControlName="description"
              required
              autocomplete="off"
              maxlength="102"
            />
            <mat-hint align="end"
              >{{
                this.form.get('description')?.value?.length || 0
              }}/102</mat-hint
            >

            <mat-error
              *ngIf="
                submitted && this.form.get('description')?.hasError('required')
              "
              >The description is mandatory.</mat-error
            >
            <mat-error
              *ngIf="
                submitted && this.form.get('description')?.hasError('maxlength')
              "
              >Maximum length is 102.</mat-error
            >
          </mat-form-field>

          <button
            mat-stroked-button
            color="primary"
            class="w-full"
            [disabled]="submitted && form.invalid"
          >
            save
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class CreateProjectComponent {
  @HostBinding('class') class = 'block w-72 relative';
  readonly form: FormGroup;
  submitted = false;

  constructor(
    private readonly _matSnackBar: MatSnackBar,
    private readonly _matDialogRef: MatDialogRef<CreateProjectComponent>
  ) {
    this.form = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(32)],
      }),
      description: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(102)],
      }),
    });
  }

  onCreateProject() {
    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this._matDialogRef.close(this.form.value);
    } else {
      this._matSnackBar.open('Invalid data. Try Again', 'close', {
        panelClass: 'warning-snackbar',
        duration: 5000,
      });
    }
  }
}
