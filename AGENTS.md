# TaskFlow Web — AGENTS

## Stack
- React 19 + TypeScript 6
- Vite 8 (bundler)
- Tailwind CSS v4 (estilos)
- React Router DOM v7 (ruteo)
- Axios (cliente HTTP)

## Comandos
- `npm run dev` — Inicia servidor de desarrollo
- `npm run build` — Compila TS y construye
- `npm run lint` — Ejecuta ESLint
- `npm run preview` — Previsualiza build de producción

## Estructura de carpetas
```
src/
├── assets/         # Imágenes, fuentes, recursos estáticos
├── components/     # Componentes reutilizables (UI atómicos/moléculas)
├── context/        # Contextos de React + hooks de consumo + archivos auxiliares
├── layouts/        # Componentes de layout (Header, Sidebar, etc.)
├── pages/          # Componentes de página (una por ruta)
├── services/       # Llamadas a API (Axios)
├── types/          # Interfaces, tipos, enums
└── utils/          # Funciones utilitarias
```

## Convenciones
- Nomenclatura: camelCase para variables/funciones, PascalCase para componentes
- Imports relativos (ej: `import { X } from '../components/X'`)
- Agrupar imports: librerías externas primero, luego internos (separados por línea en blanco)
- Usar Tailwind utility classes en lugar de CSS modules o archivos .css
- Tipado estricto con TypeScript (evitar `any` siempre que sea posible)
- Componentes funcionales con hooks (nada de clases)
- Nombres de archivo en kebab-case para páginas (ej: `task-detail.tsx`)
