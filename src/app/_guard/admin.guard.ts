import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Aquí implementaremos la lógica de verificación de rol de administrador
    const userRole = localStorage.getItem('userRole');
    const isAdmin = userRole === 'admin';

    if (!isAdmin) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
