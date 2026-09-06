# fs-project
 
Aplicacion web que permite la administracion de tareas, insercion, modificacion y eliminacion de tareas asi como tambien las marca como pendientes o realizadas, para la seguridad tiene un formulario de autenticacion.
 
<!-- BADGE_CI -->
 
## 🚀 Instalación local
 
```bash
git clone https://github.com/cmonroy66/fs-project.git
cd fs-project
npm install
```
 
### Variables de entorno
Crea un archivo `.env` en la raíz con las siguientes claves (sin valores reales en este documento):
 
```
DATABASE_URL=
JWT_SECRET=
PORT=
```
 
## 📜 Comandos disponibles
 
| Comando          | Descripción                              |
|------------------|-------------------------------------------|
| `npm run dev`    | Levanta el entorno de desarrollo           |
| `npm run build`  | Genera el build de producción              |
| `npm test`       | Corre las pruebas automatizadas (pendiente — Sesión 3) |
 
## 🗄️ Base de datos
 
PostgreSQL con migraciones y seeds gestionados con Prisma (ver Módulo 2).
# prueba de proteccion
