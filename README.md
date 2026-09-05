# Task Manager Full Stack

Aplicación web de gestión de tareas con autenticación de usuarios (React + TypeScript en el frontend, Node.js + Express en el backend).

<!-- BADGE_CI -->

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
- Token JWT para autenticación stateless, con validación de `JWT_SECRET` al iniciar el servidor
- Verificación estricta del header `Authorization` en las rutas protegidas
- Crear, completar y eliminar tareas
- Datos persistidos en PostgreSQL
- Rutas del backend protegidas con middleware JWT
- Redirección automática al login cuando el token expira o el acceso no está autorizado

---

## Estructura del proyecto

```
fs-project/
├── frontend/                   # React + TypeScript (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── TaskInput.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── TaskUtil.tsx        # Tipos Task y TaskProps
│   └── .env                    # VITE_API_URL
└── backend/                    # Node.js + Express
    ├── src/
    │   └── index.ts            # Servidor Express + rutas
    ├── prisma/
    │   └── schema.prisma       # Modelos Task y User
    └── .env                    # DATABASE_URL, JWT_SECRET
```

---

## 🚀 Instalación local

```bash
git clone git@github.com:MonicaApaza/fs-project.git
cd fs-project
```

### Variables de entorno

Antes de instalar dependencias, crea los archivos `.env` con las siguientes claves (sin valores reales en este documento):

`backend/.env`:
```
DATABASE_URL=
JWT_SECRET=
```

> El backend escucha en el puerto `1234` (fijo en `src/index.ts`); no lee `PORT` desde el entorno.

`frontend/.env`:
```
VITE_API_URL=
```

> `npm run dev` deja el proceso corriendo en primer plano — usa dos terminales, una para el backend y otra para el frontend.

### Backend (terminal 1)

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

---

## 📜 Comandos disponibles

Ejecutar dentro de `frontend/` o `backend/` según corresponda:

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el entorno de desarrollo |
| `npm run build` | Genera el build de producción (frontend) |
| `npm test` | Corre las pruebas automatizadas (pendiente — Sesión 3) |

---

## 🗄️ Base de datos

PostgreSQL con migraciones gestionadas con Prisma (`backend/prisma/schema.prisma`).

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
