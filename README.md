# TaskFlow Web

Frontend de TaskFlow, un gestor de tareas con autenticación JWT y dashboard.

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
├── api/           # Cliente Axios, servicios (auth, dashboard)
├── assets/        # Imágenes y recursos estáticos
├── components/    # Componentes reutilizables (ProtectedRoute)
├── context/       # Auth context, hook useAuth
├── pages/         # LoginPage, RegisterPage, DashboardPage
└── types/         # Interfaces compartidas (User, AuthPayload, etc.)
```

## Variables de entorno

| Variable         | Defecto               | Descripción              |
|------------------|-----------------------|--------------------------|
| `VITE_API_URL`   | `http://localhost:3000`| URL base del backend API |
