# VerPelis - Plataforma de Streaming

Una aplicación web de streaming de películas y series desarrollada con Angular 17, inspirada en Prime Video.

## Características

- 🎬 Carrusel principal con películas destacadas
- 🎯 Navegación por categorías y géneros
- 🔍 Búsqueda de películas y series
- 🎨 Diseño moderno y responsivo
- ⚡ Animaciones fluidas y transiciones suaves
- 🌙 Tema oscuro optimizado
- 📱 Diseño adaptativo para móviles

## Tecnologías Utilizadas

- Angular 17
- TypeScript
- Angular Material
- NGXS para gestión de estado
- RxJS
- SCSS
- TMDB API

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm (versión 7 o superior)
- API Key de TMDB

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

3. Configura las variables de entorno:
   - Crea un archivo `src/environments/environment.ts` basado en `environment.example.ts`
   - Añade tu API key de TMDB en el archivo de configuración

4. Inicia el servidor de desarrollo:
```bash
npm start
```

5. Abre tu navegador y visita `http://localhost:4200`

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/           # Servicios, modelos y utilidades
│   ├── features/       # Módulos de características
│   ├── shared/         # Componentes compartidos
│   └── environments/   # Configuraciones de entorno
├── assets/            # Recursos estáticos
└── styles/           # Estilos globales
```

## Componentes Principales

- `NavbarComponent`: Barra de navegación principal
- `CarouselComponent`: Carrusel de películas destacadas
- `MovieCardComponent`: Tarjeta de película individual
- `HomeComponent`: Página principal

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## Contacto

Tu Nombre - [@tutwitter](https://twitter.com/tutwitter) - email@example.com

Link del Proyecto: [https://github.com/tu-usuario/verpelis](https://github.com/tu-usuario/verpelis)
