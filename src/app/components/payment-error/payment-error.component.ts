import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-payment-error',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './payment-error.component.html',
  styleUrl: './payment-error.component.scss'
})
export class PaymentErrorComponent {
  private dialogRef = inject(MatDialogRef<PaymentErrorComponent>);
  public data = inject(MAT_DIALOG_DATA) as { message: string };

  retry(): void {
    this.dialogRef.close('retry');
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
