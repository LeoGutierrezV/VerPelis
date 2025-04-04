import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-main">
          <div class="footer-logo">
            <img src="assets/images/logo.png" alt="VerPelis">
            <p>Tu plataforma de streaming favorita</p>
          </div>

          <div class="footer-links">
            <div class="footer-section">
              <h3>Enlaces útiles</h3>
              <a routerLink="/inicio">
                <mat-icon>home</mat-icon>
                Inicio
              </a>
              <a routerLink="/peliculas">
                <mat-icon>movie</mat-icon>
                Películas
              </a>
              <a routerLink="/series">
                <mat-icon>tv</mat-icon>
                Series
              </a>
              <a routerLink="/novedades">
                <mat-icon>new_releases</mat-icon>
                Novedades
              </a>
            </div>

            <div class="footer-section">
              <h3>Mi cuenta</h3>
              <a routerLink="/perfil">
                <mat-icon>person</mat-icon>
                Mi perfil
              </a>
              <a routerLink="/mi-lista">
                <mat-icon>favorite</mat-icon>
                Mi lista
              </a>
              <a routerLink="/configuracion">
                <mat-icon>settings</mat-icon>
                Configuración
              </a>
            </div>

            <div class="footer-section">
              <h3>Ayuda</h3>
              <a routerLink="/centro-ayuda">
                <mat-icon>help</mat-icon>
                Centro de ayuda
              </a>
              <a routerLink="/contacto">
                <mat-icon>mail</mat-icon>
                Contacto
              </a>
            </div>
          </div>

          <div class="footer-social">
            <h3>Síguenos</h3>
            <div class="social-buttons">
              <a href="#" class="social-button" mat-icon-button>
                <mat-icon>facebook</mat-icon>
              </a>
              <a href="#" class="social-button" mat-icon-button>
                <mat-icon>twitter</mat-icon>
              </a>
              <a href="#" class="social-button" mat-icon-button>
                <mat-icon>instagram</mat-icon>
              </a>
              <a href="#" class="social-button" mat-icon-button>
                <mat-icon>youtube</mat-icon>
              </a>
            </div>
          </div>
        </div>

        <mat-divider class="footer-divider"></mat-divider>

        <div class="footer-bottom">
          <div class="copyright">
            © {{ currentYear }} VerPelis - Todos los derechos reservados
          </div>
          <div class="legal-links">
            <a routerLink="/privacidad">Privacidad</a>
            <a routerLink="/terminos">Términos</a>
            <a routerLink="/cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #141414;
      color: #fff;
      padding: 4rem 0 2rem;
      margin-top: 4rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .footer-main {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      gap: 4rem;
      margin-bottom: 3rem;
    }

    .footer-logo {
      img {
        height: 2.5rem;
        margin-bottom: 1rem;
      }

      p {
        color: #999;
        font-size: 0.9rem;
        line-height: 1.5;
      }
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .footer-section {
      h3 {
        color: #fff;
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 1.5rem;
      }

      a {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #999;
        text-decoration: none;
        font-size: 0.95rem;
        margin-bottom: 1rem;
        transition: all 0.3s ease;

        mat-icon {
          font-size: 1.2rem;
          width: 1.2rem;
          height: 1.2rem;
        }

        &:hover {
          color: #fff;
          transform: translateX(5px);
        }
      }
    }

    .footer-social {
      h3 {
        color: #fff;
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 1.5rem;
      }

      .social-buttons {
        display: flex;
        gap: 1rem;

        .social-button {
          color: #999 !important;
          transition: all 0.3s ease;

          &:hover {
            color: #fff !important;
            transform: translateY(-3px);
          }

          mat-icon {
            font-size: 1.5rem;
            width: 1.5rem;
            height: 1.5rem;
          }
        }
      }
    }

    .footer-divider {
      background-color: #333;
      margin: 2rem 0;
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #999;
      font-size: 0.9rem;

      .legal-links {
        display: flex;
        gap: 1.5rem;

        a {
          color: #999;
          text-decoration: none;
          transition: color 0.3s ease;

          &:hover {
            color: #fff;
          }
        }
      }
    }

    @media (max-width: 1024px) {
      .footer-main {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .footer-links {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .footer {
        padding: 3rem 0 1.5rem;
      }

      .footer-content {
        padding: 0 1rem;
      }

      .footer-links {
        grid-template-columns: 1fr;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;

        .legal-links {
          justify-content: center;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}

