# 📚 Documentación API - Inventario ESET-UNQ

## 🌐 Información General

API RESTful para la gestión de inventario de equipos informáticos de ESET-UNQ. Permite administrar usuarios, equipos, categorías y préstamos de manera centralizada y segura.

**Versión:** 1.0.0  
**Base URL (Producción):** `https://inventario-eset-unq-production.up.railway.app`  
**Base URL (Local):** `http://localhost:3000`

---

## 🔐 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticar las peticiones a rutas protegidas.

### Obtener un Token

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Admin",
    "email": "admin@example.com",
    "rol": "admin"
  }
}
```

### Usar el Token

Para acceder a rutas protegidas, incluye el token en el header de la petición:
```
Authorization: Bearer <tu_token_jwt>
```

**Ejemplo con cURL:**
```bash
curl -H "Authorization: Bearer eyJhbGc..." https://inventario-eset-unq-production.up.railway.app/api/equipos
```

---

## 📋 Endpoints

### 🔑 Auth

#### Login
- **POST** `/api/auth/login`
- **Descripción:** Autentica un usuario y retorna un token JWT
- **Auth requerida:** ❌ No
- **Body:**
```json
  {
    "email": "string",
    "password": "string"
  }
```
- **Respuestas:**
  - `200` - Login exitoso
  - `400` - Datos inválidos
  - `401` - Credenciales incorrectas
  - `500` - Error del servidor

---

### 👥 Usuarios

#### Listar Usuarios
- **GET** `/api/usuarios`
- **Descripción:** Obtiene todos los usuarios registrados
- **Auth requerida:** ❌ No
- **Respuestas:**
  - `200` - Lista de usuarios
  - `500` - Error del servidor

**Ejemplo de respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@unq.edu.ar",
    "rol": "usuario",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Crear Usuario
- **POST** `/api/usuarios`
- **Descripción:** Registra un nuevo usuario
- **Auth requerida:** ❌ No
- **Body:**
```json
  {
    "nombre": "Juan Pérez",
    "email": "juan@unq.edu.ar",
    "password": "123456",
    "rol": "usuario"
  }
```
- **Respuestas:**
  - `201` - Usuario creado
  - `400` - Datos inválidos o email duplicado
  - `500` - Error del servidor

---

### 💻 Equipos

#### Listar Equipos
- **GET** `/api/equipos`
- **Descripción:** Obtiene todos los equipos del inventario
- **Auth requerida:** ❌ No
- **Respuestas:**
  - `200` - Lista de equipos
  - `500` - Error del servidor

**Ejemplo de respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Laptop Dell Latitude 5420",
    "categoria": "Laptop",
    "estado": "disponible",
    "numero_serie": "SN123456789",
    "observaciones": "Equipo en buen estado",
    "createdAt": "2024-01-10T08:00:00.000Z"
  }
]
```

#### Crear Equipo
- **POST** `/api/equipos`
- **Descripción:** Registra un nuevo equipo en el inventario
- **Auth requerida:** ✅ Sí (Bearer Token)
- **Body:**
```json
  {
    "nombre": "Laptop Dell Latitude 5420",
    "categoria": "Laptop",
    "estado": "disponible",
    "numero_serie": "SN123456789",
    "observaciones": "Equipo nuevo con cargador"
  }
```
- **Respuestas:**
  - `201` - Equipo creado
  - `400` - Datos inválidos
  - `401` - No autorizado
  - `500` - Error del servidor

**Estados posibles:** `disponible`, `prestado`, `mantenimiento`

---

### 📦 Categorías

#### Listar Categorías
- **GET** `/api/categorias`
- **Descripción:** Obtiene todas las categorías de equipos
- **Auth requerida:** ❌ No
- **Respuestas:**
  - `200` - Lista de categorías
  - `500` - Error del servidor

**Ejemplo de respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Laptops",
    "descripcion": "Equipos portátiles tipo laptop",
    "createdAt": "2024-01-05T12:00:00.000Z"
  }
]
```

#### Crear Categoría
- **POST** `/api/categorias`
- **Descripción:** Crea una nueva categoría de equipos
- **Auth requerida:** ✅ Sí (Bearer Token)
- **Body:**
```json
  {
    "nombre": "Laptops",
    "descripcion": "Equipos portátiles tipo laptop"
  }
```
- **Respuestas:**
  - `201` - Categoría creada
  - `400` - Datos inválidos
  - `401` - No autorizado
  - `500` - Error del servidor

---

### 🔄 Préstamos

#### Listar Préstamos
- **GET** `/api/prestamos`
- **Descripción:** Obtiene todos los préstamos registrados
- **Auth requerida:** ✅ Sí (Bearer Token)
- **Respuestas:**
  - `200` - Lista de préstamos
  - `401` - No autorizado
  - `500` - Error del servidor

**Ejemplo de respuesta:**
```json
[
  {
    "id": 1,
    "id_equipo": 5,
    "id_usuario": 3,
    "estado": "aprobado",
    "fecha_prestamo": "2024-01-20T09:00:00.000Z",
    "fecha_devolucion": null,
    "observaciones": "Préstamo para proyecto de investigación"
  }
]
```

#### Crear Préstamo
- **POST** `/api/prestamos`
- **Descripción:** Crea una nueva solicitud de préstamo
- **Auth requerida:** ✅ Sí (Bearer Token)
- **Body:**
```json
  {
    "id_equipo": 5,
    "id_usuario": 3,
    "observaciones": "Necesito para proyecto"
  }
```
- **Respuestas:**
  - `201` - Préstamo creado
  - `400` - Datos inválidos o equipo no disponible
  - `401` - No autorizado
  - `404` - Equipo o usuario no encontrado
  - `500` - Error del servidor

**Estados posibles:** `pendiente`, `aprobado`, `rechazado`, `devuelto`

#### Actualizar Préstamo
- **PUT** `/api/prestamos/:id`
- **Descripción:** Actualiza el estado de un préstamo (aprobar, rechazar, devolver)
- **Auth requerida:** ✅ Sí (Bearer Token)
- **Parámetros URL:**
  - `id` (integer) - ID del préstamo
- **Body:**
```json
  {
    "estado": "aprobado",
    "observaciones": "Aprobado por administrador"
  }
```
- **Respuestas:**
  - `200` - Préstamo actualizado
  - `400` - Estado inválido
  - `401` - No autorizado
  - `404` - Préstamo no encontrado
  - `500` - Error del servidor

---

## 📊 Modelos de Datos

### Usuario
```typescript
{
  id: number
  nombre: string
  email: string
  rol: 'admin' | 'usuario'
  createdAt: Date
}
```

### Equipo
```typescript
{
  id: number
  nombre: string
  categoria: string
  estado: 'disponible' | 'prestado' | 'mantenimiento'
  numero_serie: string
  observaciones: string
  createdAt: Date
}
```

### Categoría
```typescript
{
  id: number
  nombre: string
  descripcion: string
  createdAt: Date
  updatedAt: Date
}
```

### Préstamo
```typescript
{
  id: number
  id_equipo: number
  id_usuario: number
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'devuelto'
  fecha_prestamo: Date
  fecha_devolucion: Date | null
  observaciones: string
}
```

---

## 🔧 Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| `200` | OK - Petición exitosa |
| `201` | Created - Recurso creado exitosamente |
| `400` | Bad Request - Datos inválidos o incompletos |
| `401` | Unauthorized - Token inválido o ausente |
| `404` | Not Found - Recurso no encontrado |
| `500` | Internal Server Error - Error del servidor |

---

## 🧪 Ejemplos de Uso

### JavaScript (Fetch API)
```javascript
// Login
const login = async () => {
  const response = await fetch('https://inventario-eset-unq-production.up.railway.app/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'admin@unq.edu.ar',
      password: '123456'
    })
  });
  
  const data = await response.json();
  return data.token;
};

// Crear equipo (con token)
const crearEquipo = async (token) => {
  const response = await fetch('https://inventario-eset-unq-production.up.railway.app/api/equipos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      nombre: 'Laptop HP',
      categoria: 'Laptops',
      estado: 'disponible',
      numero_serie: 'HP123456'
    })
  });
  
  return await response.json();
};
```

### Python (requests)
```python
import requests

# Login
response = requests.post(
    'https://inventario-eset-unq-production.up.railway.app/api/auth/login',
    json={
        'email': 'admin@unq.edu.ar',
        'password': '123456'
    }
)
token = response.json()['token']

# Listar equipos
response = requests.get(
    'https://inventario-eset-unq-production.up.railway.app/api/equipos'
)
equipos = response.json()

# Crear préstamo (con token)
response = requests.post(
    'https://inventario-eset-unq-production.up.railway.app/api/prestamos',
    headers={'Authorization': f'Bearer {token}'},
    json={
        'id_equipo': 5,
        'id_usuario': 3,
        'observaciones': 'Préstamo de prueba'
    }
)
```

---

## 📖 Documentación Interactiva (Swagger)

Puedes explorar y probar todos los endpoints de manera interactiva en:

**Producción:** [https://inventario-eset-unq-production.up.railway.app/api-docs](https://inventario-eset-unq-production.up.railway.app/api-docs)

**Local:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

La interfaz Swagger UI te permite:
- 📝 Ver todos los endpoints disponibles
- ✅ Probar cada endpoint directamente desde el navegador
- 🔐 Autenticarte usando el botón "Authorize"
- 📊 Ver ejemplos de request/response

---

## ⚠️ Consideraciones de Seguridad

- 🔒 Los tokens JWT expiran después de cierto tiempo
- 🔑 Nunca compartas tu token JWT públicamente
- 🚫 No envíes contraseñas en texto plano (solo a través de HTTPS)
- ✅ Valida siempre los datos de entrada en el cliente
- 🛡️ Las rutas protegidas requieren un token válido

---

## 🐛 Manejo de Errores

Todas las respuestas de error siguen este formato:
```json
{
  "error": "Descripción del error",
  "message": "Detalles adicionales (opcional)"
}
```

**Ejemplo:**
```json
{
  "error": "Token no proporcionado"
}
```

---

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades:
- 📧 Email: info@nicolascalderon.me
- 🐛 Issues: [\[GitHub Repository\]](https://github.com/nicocalderon7/inventario-eset-unq)
- 📱 Contacto: ESET-UNQ

---

## 📝 Changelog

### v1.0.0 (2025-01-26)
- ✨ Release inicial
- 🔐 Autenticación JWT
- 👥 CRUD de Usuarios
- 💻 CRUD de Equipos
- 📦 CRUD de Categorías
- 🔄 Gestión de Préstamos
- 📚 Documentación Swagger

---

**Última actualización:** 26 de Enero, 2025