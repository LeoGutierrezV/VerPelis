# VerPelis - Aplicación de Streaming de Películas

Una aplicación web moderna para ver películas, construida con Angular y la API de TMDB.

## Características

- 🎬 Exploración de películas populares, mejor valoradas y próximas a estrenarse
- 🔍 Búsqueda de películas por título
- ❤️ Sistema de favoritos
- 📱 Diseño responsive
- 🌙 Modo oscuro
- 🌍 Soporte multiidioma (Español e Inglés)
- ♿ Características de accesibilidad
- 🔒 Autenticación de usuarios
- 📊 Historial de visualización
- ⚡ Optimización de rendimiento

## Tecnologías Utilizadas

- Angular 17
- TypeScript
- RxJS
- NGXS para gestión de estado
- Angular Material
- Tailwind CSS
- Jest para pruebas unitarias
- Cypress para pruebas e2e

## Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Angular CLI (v17 o superior)

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/verpelis.git
cd verpelis
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `environment.ts` en `src/environments/` con tus credenciales de TMDB:
```typescript
export const environment = {
  production: false,
  tmdbApiUrl: 'https://api.themoviedb.org/3',
  tmdbApiKey: 'TU_API_KEY',
  imageBaseUrl: 'https://image.tmdb.org/t/p',
  defaultLanguage: 'es-ES'
};
```

4. Inicia el servidor de desarrollo:
```bash
ng serve
```

5. Abre tu navegador y visita `http://localhost:4200`

## Estructura del Proyecto

```
src/
├── app/
│   ├── _components/     # Componentes compartidos
│   ├── _constants/      # Constantes de la aplicación
│   ├── _guards/         # Guards de rutas
│   ├── _interceptors/   # Interceptores HTTP
│   ├── _model/          # Interfaces y modelos
│   ├── _service/        # Servicios
│   ├── _store/          # Estado global (NGXS)
│   ├── _types/          # Tipos TypeScript
│   ├── pages/           # Componentes de páginas
│   └── shared/          # Módulos compartidos
├── assets/             # Recursos estáticos
└── environments/       # Configuraciones de entorno
```

## Pruebas

### Pruebas Unitarias
```bash
npm run test
```

### Pruebas e2e
```bash
npm run e2e
```

## Características de Accesibilidad

- Soporte para lectores de pantalla
- Navegación por teclado
- Modo de alto contraste
- Tamaños de fuente ajustables
- Reducción de movimiento

## Optimizaciones de Rendimiento

- Lazy loading de módulos
- Caché de datos
- Optimización de imágenes
- Virtual scrolling
- Service workers para offline

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## Contacto

Tu Nombre - [@tutwitter](https://twitter.com/tutwitter) - email@example.com

Link del Proyecto: [https://github.com/tu-usuario/verpelis](https://github.com/tu-usuario/verpelis)
