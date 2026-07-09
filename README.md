# Task Manager Full Stack

Aplicación web de gestión de tareas con autenticación de usuarios. Construida con React + TypeScript en el frontend y Node.js + Express en el backend, con base de datos PostgreSQL gestionada mediante Prisma.

**Frontend:** https://fs-project-five.vercel.app/  
**Backend:** https://fs-project-si59.onrender.com

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 19, TypeScript, React Router, Vite |
| Backend | Node.js, Express 5 |
| Base de datos | PostgreSQL, Prisma 6 |
| Autenticación | JWT, bcrypt |

---

## Funcionalidades

- Registro e inicio de sesión con contraseñas protegidas con bcrypt
- Token JWT para autenticación stateless
- Crear, completar y eliminar tareas
- Datos persistidos en PostgreSQL
- Rutas del backend protegidas con middleware JWT
- Redirección automática al login cuando el token expira

---

## Estructura del proyecto

```
fs-project-manager/
├── src/                        # Frontend React
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Login.tsx
│   │   ├── TaskInput.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskCard.tsx
│   │   ├── Footer.tsx
│   │   └── EmptyState.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── TaskUtil.tsx            # Tipos Task y TaskProps
├── backend/
│   ├── src/
│   │   └── index.ts            # Servidor Express + rutas
│   └── prisma/
│       └── schema.prisma       # Modelos Task y User
├── .env.local                  # VITE_API_URL
└── backend/.env                # DATABASE_URL
```

---

## Instalación y uso local

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Variables de entorno

**Frontend** — `.env.local`:
```
VITE_API_URL=http://localhost:1234
```

**Backend** — `backend/.env`:
```
DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db?schema=public"
```

---

## API Endpoints

| Método | Ruta | Protegida | Descripción |
|---|---|---|---|
| GET | `/` | No | Health check |
| POST | `/register` | No | Registro de usuario |
| POST | `/login` | No | Login — devuelve JWT |
| GET | `/profile` | Sí | Perfil del usuario autenticado |
| GET | `/tasks` | Sí | Listar todas las tareas |
| POST | `/tasks` | Sí | Crear tarea |
| PATCH | `/tasks/:id` | Sí | Actualización parcial de tarea |
| PUT | `/tasks/:id` | Sí | Actualización completa de tarea |
| DELETE | `/tasks/:id` | Sí | Eliminar tarea |

Las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

---

## Despliegue

- **Frontend** desplegado en [Vercel](https://vercel.com)
- **Backend** desplegado en [Render](https://render.com)
- La variable `VITE_API_URL` apunta a la URL del backend en producción


