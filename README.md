# TaskFlow Web

Frontend de TaskFlow, un gestor de tareas con autenticación JWT, tablero Kanban, proyectos y panel de administración.

## Stack

- **React 19** + **TypeScript 6**
- **Vite 8** (bundler y dev server)
- **Tailwind CSS v4** (estilos)
- **React Router DOM v7** (ruteo)
- **Axios** (cliente HTTP)

## Scripts

```bash
npm run dev      # Servidor de desarrollo (localhost:5173)
npm run build    # Compila TS y construye en /dist
npm run preview  # Previsualiza la build de producción
npm run lint     # Ejecuta ESLint
```

## Estructura

```
src/
├── api/           # Cliente Axios + servicios (auth, dashboard, tasks, projects, comments, users)
├── assets/        # Imágenes y recursos estáticos
├── components/    # Componentes UI (Sidebar, Header, KanbanColumn, TaskCard, CommentModal, etc.)
├── config/        # Configuración del tablero Kanban
├── context/       # AuthContext + hook useAuth
├── hooks/         # Custom hooks (useAsyncState)
├── layouts/       # AppLayout (Header + Sidebar + Footer)
├── pages/         # Login, Register, Dashboard, Projects, ProjectDetail, Tasks, Settings
├── types/         # Interfaces compartidas (User, Project, Task, Comment, TaskStatus, etc.)
└── utils/         # Funciones utilitarias (theme, initials)
```

## Rutas

| Ruta               | Página           | Requiere auth |
|--------------------|------------------|---------------|
| `/login`           | Login            | No            |
| `/register`        | Registro         | No            |
| `/dashboard`       | Dashboard        | Sí            |
| `/projects`        | Lista proyectos  | Sí            |
| `/projects/:id`    | Detalle proyecto | Sí            |
| `/tasks`           | Tablero Kanban   | Sí            |
| `/settings`        | Configuración    | Sí            |

## Variables de entorno

| Variable         | Defecto               | Descripción              |
|------------------|-----------------------|--------------------------|
| `VITE_API_URL`   | `http://localhost:3000`| URL base del backend API |
