import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="error-container">
      <mat-icon class="error-icon">error_outline</mat-icon>
      <p class="error-text">{{ message }}</p>
      <button mat-raised-button color="primary" (click)="retry.emit()">
        <mat-icon>refresh</mat-icon>
        Reintentar
      </button>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
      color: var(--text-color);
      gap: 1rem;
    }

    .error-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: var(--error-color);
    }

    .error-text {
      font-size: 1.1rem;
      margin: 0;
    }

    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message = 'Ha ocurrido un error';
  @Output() retry = new EventEmitter<void>();
}
