import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-display',
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorDisplayComponent {
  @Input() message = 'An error occurred. Please try again.';
  @Input() retryable = true;

  onRetry(): void {
    // Emit retry event which parent component can listen to
    window.location.reload();
  }
}
