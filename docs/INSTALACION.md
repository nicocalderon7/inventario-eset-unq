# Instalación

Este documento explica cómo preparar y ejecutar el proyecto completo (backend + frontend) en desarrollo y en producción.

**Prerequisitos**

- **Node.js**: versión 16+ (recomendado 18+). Asegúrate que `node` y `npm` estén en el `PATH`.
- **npm** (incluido con Node) o `pnpm`/`yarn` según preferencia.
- **PostgreSQL** (local) o un servicio en la nube que provea una `DATABASE_URL` (por ejemplo Railway, Heroku). Si usas un proveedor en la nube, copia la `DATABASE_URL` que te entreguen.

**Estructura relevante**

- Backend: [backend/src/index.ts](backend/src/index.ts#L1-L74)
- Frontend: [frontend](frontend)
- Esquema de base de datos: [database/schema.sql](database/schema.sql)

## Backend

1. Abrir terminal y entrar al directorio del backend:

```bash
cd backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Variables de entorno (archivo `backend/.env`)

- Crear un archivo `.env` en `backend/` con al menos las variables `DATABASE_URL`, `JWT_SECRET` y opcionalmente `PORT`.
- Ejemplo mínimo (`backend/.env`):

```env
# Cadena de conexión completa: postgres://<usuario>:<password>@<host>:<puerto>/<db>
DATABASE_URL=postgres://inventario:secret_password@localhost:5432/inventario

# Clave para firmar JWT. Usar una cadena larga y segura en producción.
JWT_SECRET=una_clave_muy_segura_de_al_menos_32_caracteres

# Puerto en el que correrá el backend (opcional, 3000 por defecto)
PORT=3000
```

Nota: El archivo `backend/src/config/database.ts` actualmente fuerza la conexión SSL (útil para Railway/Heroku). Para un Postgres local sin SSL, cambia temporalmente la opción `dialectOptions.ssl.require` a `false` o remueve `dialectOptions`.

Si prefieres no tocar el código, usa una base de datos en la nube (Railway, Heroku) cuyo `DATABASE_URL` ya incluye TLS.

4. Ejecutar en desarrollo (hot-reload):

```bash
cd backend
npm run dev
```

5. Compilar y ejecutar en producción:

```bash
npm run build
npm start
```

6. Verificar la API

- La API pública ofrece documentación Swagger en `/api-docs` (ej. `http://localhost:3000/api-docs`).

## Base de datos

1. Opciones para preparar la base de datos

a) Usando PostgreSQL local (ejemplos de comandos `psql`/PowerShell):

```powershell
# Conéctate como superusuario (ej. postgres) y crea usuario y base
psql -U postgres -c "CREATE USER inventario WITH PASSWORD 'secret_password';"
psql -U postgres -c "CREATE DATABASE inventario OWNER inventario;"

# Aplicar esquema SQL al nuevo esquema
psql -U inventario -d inventario -f database/schema.sql
```

b) Usando `DATABASE_URL` de un proveedor (Railway/Heroku):

- Copia la `DATABASE_URL` que te dé el proveedor y pégala en `backend/.env`.

c) Notas sobre SSL

- `backend/src/config/database.ts` activa `ssl.require = true`. Si trabajas localmente sin TLS, edita ese archivo y pon `require: false` o elimina `dialectOptions` para evitar errores de conexión.

d) `sequelize.sync()`

- El backend llama a `sequelize.sync()` al iniciar; con esto Sequelize creará las tablas faltantes. Aún así se recomienda aplicar `database/schema.sql` para el esquema inicial.

## Frontend

1. Abrir otra terminal y entrar al directorio del frontend:

```bash
cd frontend
```

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar en desarrollo (Vite):

```bash
npm run dev
```

4. Construir para producción:

```bash
npm run build
npm run preview
```

5. Configurar la URL del backend (Vite)

- El frontend usa la variable de entorno `VITE_API_URL`. Crea `frontend/.env` y añade la URL base del backend:

```env
# Ejemplo para desarrollo local
VITE_API_URL=http://localhost:3000
```

- `src/services/api.ts` usa `import.meta.env.VITE_API_URL || 'http://localhost:3000'`.

- Si despliegas el frontend a producción y la API está en otro dominio, actualiza `VITE_API_URL` antes de `npm run build`.

## Tests

- Backend: `cd backend && npm test` (utiliza Jest).

Windows note: si `psql` no está en el `PATH` en Windows, instala PostgreSQL (opción «Command Line Tools») o usa la terminal de PostgreSQL incluida.

## Despliegue rápido (sugerencia)

- Backend: compilar con `npm run build` y ejecutar `npm start` en un servidor Node, o desplegar directamente a plataformas que usan `DATABASE_URL` (Railway/Heroku).
- Frontend: `npm run build` y servir los archivos estáticos en cualquier CDN/hosting (Netlify, Vercel) o detrás de un servidor web.

---

