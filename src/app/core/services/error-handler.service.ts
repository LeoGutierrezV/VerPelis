import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: Error | HttpErrorResponse): void {
    let errorMessage = 'An unexpected error occurred';

    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        errorMessage = 'No internet connection';
      } else {
        // Handle HTTP errors
        switch (error.status) {
          case 401:
            errorMessage = 'Authentication error, please check your API key';
            break;
          case 404:
            errorMessage = 'The requested resource was not found';
            break;
          case 429:
            errorMessage = 'Too many requests, please try again later';
            break;
          case 500:
            errorMessage = 'Server error, please try again later';
            break;
          default:
            errorMessage = `Error: ${error.statusText}`;
            // Include more details if available
            if (error.error && error.error.status_message) {
              errorMessage += `: ${error.error.status_message}`;
            }
        }
      }
    } else {
      // Client-side error
      errorMessage = error.message || errorMessage;
    }

    // Log error
    console.error('Error occurred:', error);

    // Show error to user
    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
}
