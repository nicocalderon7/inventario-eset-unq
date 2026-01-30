# Manual de Usuario — Sistema de Inventario UNQ

Este manual detalla el uso básico del sistema para los dos roles principales: **Administrador** y **Docente**. Incluye pasos concretos en la interfaz (frontend) y acciones administrativas comunes.

## Acceso

### URLs principales

| Componente | Dirección | Puerto |
|-----------|-----------|--------|
| Frontend (Vite) | http://localhost:5173 | 5173 |
| Backend (API) | http://localhost:3000 | 3000 |
| Documentación API (Swagger) | http://localhost:3000/api-docs | 3000 |

### Iniciar sesión

1. Abre el navegador y ve a `http://localhost:5173`.
2. Ingresa tu email y contraseña.
3. Si recibes `Credenciales inválidas`:
   - Verifica que el usuario exista en la base de datos.
   - Asegúrate de usar la contraseña correcta.
   - Si olvidaste la contraseña, el administrador debe crear una nueva.

## Roles y permisos

### Administrador
- **Código interno**: `rol: admin`
- **Permisos**:
  - ✅ Crear, editar y eliminar usuarios
  - ✅ Crear, editar y eliminar equipos
  - ✅ Aprobar o rechazar solicitudes de préstamo
  - ✅ Registrar entrega y devolución de equipos
  - ✅ Ver todos los préstamos del sistema
  - ✅ Acceder al panel administrativo

### Docente
- **Código interno**: `rol: user`
- **Permisos**:
  - ✅ Solicitar préstamos de equipos disponibles
  - ✅ Ver el estado de sus propias solicitudes
  - ✅ Ver catálogo completo de equipos
  - ❌ No puede crear ni eliminar usuarios
  - ❌ No puede crear ni editar equipos
  - ❌ No puede aprobar préstamos

## Flujo rápido — Administrador

### 1. Acceder al panel administrativo

Tras iniciar sesión como administrador, verás en la barra lateral izquierda una sección **Admin** con acceso a:
- Usuarios
- Equipos
- Préstamos

### 2. Gestión de Usuarios

**Crear un nuevo usuario:**
1. Clic en **Usuarios** → **Agregar Usuario** (botón verde)
2. Rellena los campos:
   - **Nombre** y **Apellido**: nombre completo
   - **Email**: correo único (ej. `docente@unq.edu.ar`)
   - **Contraseña**: crear contraseña segura (se almacena hasheada en BD)
   - **Rol**: selecciona **Administrador** o **Docente**
   - **Área** (opcional): departamento o facultad
3. Clic en **Guardar**

**Editar usuario existente:**
1. Busca el usuario en la tabla (usa el campo de búsqueda)
2. Clic en el icono **✏️ editar** al lado del nombre
3. Modifica los campos necesarios
4. Clic en **Guardar**

**Eliminar usuario:**
1. Clic en el icono **🗑️ papelera** junto al usuario
2. Confirma la eliminación (⚠️ acción irreversible)

Consejo: usa el filtro de búsqueda en la parte superior para localizar usuarios rápidamente.

### 3. Gestión de Equipos

**Crear un equipo:**
1. Clic en **Equipos** → **Agregar Equipo**
2. Rellena los datos:
   - **Nombre**: identificador del equipo (ej. "Laptop Dell XPS")
   - **Categoría**: tipo de equipo (ej. "Laptop", "Monitor", "Cables")
   - **Marca**: fabricante (ej. "Dell")
   - **Modelo**: modelo específico (ej. "XPS 15")
   - **N° Serie**: número de serie único
   - **N° Patrimonio**: código interno UNQ
   - **Estado**: selecciona `disponible` (el equipo está listo para préstamo)
   - **Observaciones**: notas (ej. "SSD 512GB, RAM 16GB")
3. Clic en **Guardar**

**Estados posibles de un equipo:**
- `disponible` — puede ser solicitado en préstamo
- `prestado` — actualmente con un usuario
- `dañado` — no puede prestarse, requiere reparación
- `en_reparacion` — en mantenimiento

**Editar/Eliminar:** usa los iconos ✏️ y 🗑️ como en usuarios.

### 4. Gestión de Préstamos (Rol Administrador)

**Ver solicitudes pendientes:**
1. Clic en **Préstamos**
2. Usa el filtro **Estados** para ver solo `Pendientes`

**Aprobar una solicitud:**
1. Selecciona una solicitud con estado **Pendiente**
2. Clic en botón verde **Aprobar**
3. La solicitud cambia a estado `aprobado`

**Rechazar una solicitud:**
1. Clic en botón rojo **Rechazar**
2. (Opcional) ingresa un motivo
3. La solicitud cambia a `rechazado`

**Registrar entrega:**
1. Después de aprobar, busca la solicitud en estado `aprobado`
2. Clic en **Registrar Entrega**
3. Confirma: el equipo se marca como `entregado`

**Registrar devolución:**
1. Busca la solicitud en estado `entregado` (equipo actualmente con el usuario)
2. Clic en **Registrar Devolución**
3. El equipo vuelve al estado `disponible`

**Consejo:** revisa regularmente las solicitudes pendientes; monitorea los equipos que llevan mucho tiempo en préstamo.

## Flujo rápido — Docente

### 1. Solicitar un préstamo

**Pasos:**
1. Inicia sesión como docente
2. En la barra lateral, abre **Solicitar Préstamo**
3. Verás una lista de equipos con estado `disponible`
4. Busca el equipo que necesitas (por nombre o categoría)
5. Haz clic en el equipo para seleccionarlo
6. (Opcional) escribe en **"Motivo o detalles del préstamo"** por qué lo necesitas
7. Clic en **Enviar Solicitud**
8. Recibirás confirmación: la solicitud está en estado `pendiente`

**¿Qué pasa después?**
- El administrador revisará tu solicitud
- Si la aprueba, verás estado `aprobado`
- El administrador registrará la entrega y pasará a `entregado`
- Cuando devuelvas el equipo, el estado volverá a `disponible`

### 2. Verificar estado de tus solicitudes

1. Clic en **Mis Solicitudes**
2. Verás una tabla con:
   - Equipo solicitado
   - Usuario (tú mismo)
   - Fecha de solicitud
   - **Estado actual** (consulta la tabla de estados abajo)
3. Usa el filtro de **Estados** para ver solo `pendientes`, `entregados`, etc.

### 3. Tabla de estados de solicitud de préstamo

| Estado | Significa | Acción |
|--------|-----------|--------|
| `pendiente` | Tu solicitud fue creada, espera revisión del admin | Espera a que el administrador la revise |
| `aprobado` | El administrador aprobó tu solicitud | El admin registrará la entrega en breve |
| `entregado` | Ya tienes el equipo en tu poder | Úsalo según lo acordado |
| `devuelto` | Devolviste el equipo, préstamo completado | Puedes solicitar otro |
| `rechazado` | El administrador rechazó tu solicitud | Solicita otro equipo o contacta al admin |

**Consejo:** no esperes equipos que están en estado `dañado` o `en_reparacion`; siempre habrá equipos `disponibles`.

## Cómo crear el primer administrador (Setup inicial)

Si acabas de instalar el sistema y no tienes usuarios en la base de datos:

### Opción 1: Usando Node.js + SQL directo (recomendado)

**Paso 1:** Genera el hash de contraseña en una terminal (con Node.js instalado):

```bash
node -e "const bcrypt=require('bcrypt'); bcrypt.hash('Admin123!Segura',10).then(h=>console.log(h))"
```

Verás algo como:
```
$2b$10$AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz
```

Copia ese hash (todo lo que sale, incluyendo `$2b$10$`).

**Paso 2:** Abre `psql` y conecta a tu base de datos:

```bash
psql -U inventario -d inventario
```

**Paso 3:** Inserta el usuario admin:

```sql
INSERT INTO usuarios (nombre, apellido, password, rol, email, area, created_at, updated_at)
VALUES (
  'Administrador',
  'UNQ',
  '$2b$10$AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz',
  'admin',
  'admin@unq.edu.ar',
  'Sistemas',
  now(),
  now()
);
```

**Paso 4:** Verifica la inserción:

```sql
SELECT * FROM usuarios;
```

**Paso 5:** Inicia sesión en la aplicación:
- Email: `admin@unq.edu.ar`
- Contraseña: `Admin123!Segura` (la que usaste en el paso 1)

### Seguridad: ⚠️ Importante

- **Usa contraseñas fuertes:** mínimo 12 caracteres, mayúsculas, minúsculas, números y símbolos.
- **Nunca compartas hashes:** no publiques el resultado de `bcrypt.hash()` en redes ni canales públicos.
- **En producción:** guarda la contraseña del admin en un gestor de secretos, no en texto plano.
- **Cambia la contraseña inicial:** tras crear el admin, modifica la contraseña desde la interfaz.

## Errores comunes y soluciones rápidas

### Error: "Credenciales inválidas" al iniciar sesión

**Causas posibles:**
- Email no existe en la base de datos
- Contraseña incorrecta
- Usuario fue eliminado

**Solución:**
1. Verifica con un administrador que tu usuario exista
2. Si olvidaste la contraseña, pide al admin que la reestablezca
3. Si eres administrador, crea un nuevo usuario desde **Usuarios → Agregar Usuario**

---

### Error 401 / "Token inválido o expirado"

**¿Qué significa?**
Tu sesión expiró o el token JWT no es válido (duración máxima: 8 horas).

**Solución:**
1. Haz clic en **Cerrar sesión** (avatar usuario → Logout)
2. Borra el navegador cache si es necesario (`Ctrl+Shift+Delete`)
3. Vuelve a iniciar sesión
4. Si persiste, verifica con tu admin que `JWT_SECRET` esté configurado en `backend/.env`

---

### Error de conexión a la base de datos

**¿Qué significa?**
El backend no puede conectar a PostgreSQL.

**Solución (administrador del servidor):**
1. Abre `backend/.env`
2. Verifica `DATABASE_URL`:
   - ¿Tiene formato correcto? `postgres://usuario:password@host:puerto/base`
   - ¿La base existe? Crea con: `psql -U postgres -c "CREATE DATABASE inventario;"`
   - ¿El usuario tiene permisos? Crea con: `psql -U postgres -c "CREATE USER inventario WITH PASSWORD 'pass'; GRANT ALL PRIVILEGES ON DATABASE inventario TO inventario;"`
3. Reinicia el backend: `npm run dev`

---

### Error SSL/TLS en PostgreSQL

**¿Qué significa?**
"ENOTFOUND" o "Certificate verification failed" al conectar.

**Solución:**
- **Si usas Railway/Heroku:** mantén `dialectOptions.ssl.require = true` en `backend/src/config/database.ts` (ya está configurado)
- **Si usas PostgreSQL local sin SSL:** edita `backend/src/config/database.ts` y cambia:
  ```typescript
  dialectOptions: {
    ssl: {
      require: false,  // 👈 Cambiar a false
      rejectUnauthorized: false
    }
  }
  ```
  Luego reinicia el backend.

---

### Frontend no carga o muestra "Cannot GET /"

**Causas:**
- El servidor Vite no está corriendo
- Puerto 5173 está ocupado

**Solución:**
```bash
cd frontend
npm run dev
```

Si el puerto está ocupado:
```bash
npm run dev -- --port 5174
```

---

### No puedo ver equipos en "Solicitar Préstamo"

**Causas:**
- No hay equipos con estado `disponible`
- Solo se muestran equipos disponibles para docentes

**Solución:**
- Si eres admin: ve a **Equipos** y crea al menos uno con estado `disponible`
- Si eres docente: espera a que el admin agregue equipos



## Buenas prácticas

### Administrador

1. **Usuarios y roles:**
   - Crea usuarios con emails institucionales (ej. `nombre@unq.edu.ar`)
   - Asigna el rol correcto desde el inicio
   - Revisa periódicamente que no haya usuarios duplicados

2. **Inventario de equipos:**
   - Actualiza el estado del equipo cuando cambie (ej. de `disponible` a `dañado`)
   - Mantén números de serie precisos para auditoría
   - Añade observaciones útiles (ej. "SSD nuevo 2025", "Falta cable de alimentación")

3. **Préstamos:**
   - Revisa solicitudes pendientes al menos una vez por turno
   - Registra entregas/devoluciones el mismo día para evitar confusiones
   - Rechaza claramente si el equipo está dañado o en reparación

4. **Seguridad:**
   - Cambia la contraseña del admin al menos cada 3 meses
   - No compartas credenciales de admin con docentes
   - Audita intentos fallidos de login en los logs del servidor

### Docente

1. **Solicitar préstamos:**
   - Sé preciso en el motivo: esto ayuda al admin a aprobar rápidamente
   - Solicita con anticipación si necesitas el equipo en fecha específica
   - Revisa el estado de tu solicitud regularmente

2. **Usar equipos prestados:**
   - Cuida los equipos como si fueran propios
   - Reporta daños **inmediatamente** al administrador
   - No hagas modificaciones de hardware sin permiso

3. **Devolver equipos:**
   - Devuelve a tiempo (respeta las fechas acordadas)
   - Limpia el equipo antes de devolverlo
   - Comprueba que no falta accesorios (cables, adaptadores, etc.)

---

## Ejemplos de uso (API)

Si eres desarrollador o necesitas integración API:

### Autenticación (POST /api/auth/login)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@unq.edu.ar",
    "password": "Admin123!Segura"
  }'
```

**Respuesta exitosa (200):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Administrador",
    "apellido": "UNQ",
    "email": "admin@unq.edu.ar",
    "rol": "admin"
  }
}
```

### Crear solicitud de préstamo (POST /api/prestamos)

```bash
curl -X POST http://localhost:3000/api/prestamos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "id_equipo": 5,
    "id_usuario": 2,
    "observaciones": "Necesito la laptop para clase de Python"
  }'
```

**Respuesta exitosa (201):**
```json
{
  "id": 12,
  "id_usuario": 2,
  "id_equipo": 5,
  "estado": "pendiente",
  "fecha_solicitud": "2025-01-30T14:32:00Z",
  "observaciones": "Necesito la laptop para clase de Python"
}
```

---

## Soporte y contacto

### Reportar un problema

Si aparece un error que no puedes resolver:

1. **Anota:**
   - Pasos exactos para reproducir el error
   - Mensajes que ves en pantalla (o consola del navegador: `F12 → Console`)
   - Tu rol (administrador / docente)

2. **Proporciona al equipo de soporte:**
   - Descripción clara del problema
   - Pantallazos si es posible
   - Logs del servidor (si tienes acceso a `backend/`)

3. **Revisa primero:**
   - ¿Está el backend corriendo? (`npm run dev` en carpeta `backend`)
   - ¿Está el frontend corriendo? (`npm run dev` en carpeta `frontend`)
   - ¿PostgreSQL está activo?

### Recursos útiles

- **Documentación de API:** visita `http://localhost:3000/api-docs` (Swagger)
- **Código fuente:** ver `backend/src` y `frontend/src`
- **Instalación:** consulta [INSTALACION.md](./INSTALACION.md)
- **Proyecto:** ver [PROYECTO.md](./PROYECTO.md)

---

**Última actualización:** enero 2025
