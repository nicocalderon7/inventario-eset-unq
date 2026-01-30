# Guía de Contribución — Sistema de Inventario UNQ

¡Gracias por tu interés en contribuir! Este documento detalla cómo trabajar en el proyecto, reportar bugs, sugerir mejoras y enviar pull requests.

## Tabla de contenidos

1. [Código de conducta](#código-de-conducta)
2. [Cómo reportar un bug](#cómo-reportar-un-bug)
3. [Cómo sugerir una mejora](#cómo-sugerir-una-mejora)
4. [Configuración del entorno de desarrollo](#configuración-del-entorno-de-desarrollo)
5. [Flujo de trabajo con Git](#flujo-de-trabajo-con-git)
6. [Estándares de código](#estándares-de-código)
7. [Estructura del proyecto](#estructura-del-proyecto)
8. [Pruebas](#pruebas)
9. [Proceso de pull request](#proceso-de-pull-request)
10. [Contacto](#contacto)

---

## Código de conducta

Esperamos que todos los contribuyentes mantengan un ambiente respetuoso y profesional:

- **Sé respetuoso:** todos tienen perspectivas valiosas
- **Sé constructivo:** critica ideas, no personas
- **Sé inclusivo:** valoramos la diversidad
- **Sé transparente:** reporta issues de forma clara y honesta

---

## Cómo reportar un bug

### Antes de reportar

1. **Verifica que sea un bug real:**
   - Reproduce el error con pasos claros
   - Revisa si ya existe un issue similar en GitHub (si aplica)
   - Consulta [MANUAL-USUARIO.md](./MANUAL-USUARIO.md) y [INSTALACION.md](./INSTALACION.md)

2. **Reúne información:**
   - Sistema operativo (Windows, Linux, macOS)
   - Versión de Node.js: `node --version`
   - Versión del navegador
   - Pasos exactos para reproducir

### Al reportar

Crea un issue con la siguiente información:

```markdown
**Descripción del bug:**
Breve resumen de lo que pasó.

**Pasos para reproducir:**
1. Abre la pantalla de...
2. Haz clic en...
3. Introduce...

**Comportamiento esperado:**
Qué debería pasar

**Comportamiento actual:**
Qué pasa realmente

**Entorno:**
- OS: Windows 11
- Node: 18.17.0
- Navegador: Chrome 120

**Logs/Errores:**
Copia el error exacto de la consola (F12 → Console)

**Capturas de pantalla:**
Si es útil, adjunta imágenes
```

---

## Cómo sugerir una mejora

### Criterios para una buena sugerencia

- ✅ **Útil:** resuelve un problema real o mejora la experiencia
- ✅ **Factible:** se puede implementar con los recursos actuales
- ✅ **Específica:** describe claramente qué se debería cambiar
- ✅ **Justificada:** explica por qué es importante

### Plantilla de sugerencia

```markdown
**Descripción:**
Qué funcionalidad o mejora sugieres

**Problema que resuelve:**
Qué problema actual intenta solucionar

**Solución propuesta:**
Cómo debería implementarse

**Alternativas consideradas:**
Otros enfoques que podrían funcionar

**Impacto:**
¿Afecta a admin, docente o ambos?
```

---

## Configuración del entorno de desarrollo

### Requisitos previos

- **Node.js** 16+ (recomendado 18+)
- **npm** o yarn
- **PostgreSQL** 12+ o acceso a proveedor en la nube
- **Git** configurado

### Setup inicial

1. **Clona el repositorio:**

```bash
git clone https://github.com/tu-usuario/inventario-eset-unq.git
cd inventario-eset-unq
```

2. **Backend:**

```bash
cd backend
npm install
cp .env.example .env  # Crear archivo .env (ver INSTALACION.md)
npm run dev
```

3. **Frontend (en otra terminal):**

```bash
cd frontend
npm install
npm run dev
```

4. **Base de datos:**
   - Configura `DATABASE_URL` en `backend/.env`
   - El backend ejecutará `sequelize.sync()` al iniciar

5. **Verifica que todo funcione:**
   - Frontend: `http://localhost:5173` (debe cargar login)
   - Backend: `http://localhost:3000` (debe responder JSON)
   - API Docs: `http://localhost:3000/api-docs` (Swagger)

---

## Flujo de trabajo con Git

### Ramas

Usamos el siguiente esquema de ramas:

```
main (producción)
 ├── develop (desarrollo principal)
 │    ├── feature/nombre-funcionalidad
 │    ├── bugfix/nombre-del-bug
 │    └── refactor/nombre-refactor
```

### Crear una rama de trabajo

1. **Actualiza main:**

```bash
git checkout main
git pull origin main
```

2. **Crea tu rama de trabajo:**

```bash
git checkout -b feature/descripcion-corta
```

**Nombrado de ramas:**
- `feature/login-con-email` — nueva funcionalidad
- `bugfix/error-creacion-usuarios` — corrección de bug
- `refactor/simplificar-rutas` — mejora de código
- `docs/guia-contribucion` — cambios en docs

### Commits

**Reglas:**

- **Frecuentes:** haz commits pequeños y focalizados
- **Descriptivos:** el mensaje debe explicar el *qué* y el *por qué*
- **Formato:** `<tipo>: <descripción>`

**Ejemplos:**

```bash
git commit -m "feat: agregar filtro de equipos por categoría"
git commit -m "fix: corregir error en validación de email"
git commit -m "docs: actualizar guía de instalación"
git commit -m "refactor: simplificar lógica de autenticación"
```

**Tipos de commits:**
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `refactor:` mejora de código sin cambiar funcionalidad
- `perf:` mejora de rendimiento
- `test:` agregar/actualizar tests
- `style:` formato, sin cambios lógicos

---

## Estándares de código

### Backend (TypeScript + Express + Sequelize)

**Linting:**

```bash
cd backend
npm run lint  # Si está configurado, ajusta según .eslintrc
```

**Estilo:**

- Usa **TypeScript** estrictamente (types definidos)
- Variables en **camelCase**: `let usuarioId = 1`
- Constantes en **UPPER_SNAKE_CASE**: `const MAX_INTENTOS = 5`
- Funciones descriptivas: `async crearUsuarioConEmail()` vs `async crear()`
- Comenta lógica compleja
- Maneja errores con try-catch

**Ejemplo:**

```typescript
import { Request, Response } from 'express';
import Usuario from '../models/Usuario.js';

export const crearUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password } = req.body;
    
    // Validar entrada
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Campos requeridos' });
    }
    
    // Crear usuario
    const usuario = await Usuario.create({ nombre, email, password });
    res.status(201).json(usuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};
```

### Frontend (React + TypeScript + Tailwind)

**Estilo:**

- Componentes en **PascalCase**: `EquipoForm.tsx`
- Props y hooks en **camelCase**: `const handleSubmit = () => {}`
- Usa **funciones flecha** para componentes
- Props tipadas con interfaces
- Evita `any`, usa tipos específicos

**Ejemplo:**

```typescript
import { useState } from 'react';
import { Modal } from '../common/Modal';
import type { Equipo } from '../../types';

interface EquipoFormProps {
  equipo?: Equipo;
  onSubmit: (data: Equipo) => Promise<void>;
  loading?: boolean;
}

export const EquipoForm: React.FC<EquipoFormProps> = ({ 
  equipo, 
  onSubmit, 
  loading = false 
}) => {
  const [nombre, setNombre] = useState(equipo?.nombre || '');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...equipo, nombre });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Formulario */}
    </form>
  );
};
```

---

## Estructura del proyecto

```
inventario-eset-unq/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración (BD, Swagger)
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── middlewares/     # Auth, validaciones
│   │   ├── models/          # Modelos Sequelize
│   │   ├── routes/          # Definición de rutas
│   │   └── index.ts         # Entrada principal
│   ├── .env.example         # Variables de entorno
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── context/         # Context API (Auth)
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Páginas (Admin/Docente)
│   │   ├── services/        # API client (axios)
│   │   ├── types/           # Tipos TypeScript
│   │   └── main.tsx         # Entrada principal
│   ├── package.json
│   └── tsconfig.json
├── database/
│   └── schema.sql           # Script inicial de BD
├── docs/
│   ├── INSTALACION.md       # Guía de instalación
│   ├── MANUAL-USUARIO.md    # Manual de usuario
│   ├── PROYECTO.md          # Descripción del proyecto
│   └── CONTRIBUTING.md      # Esta guía
├── .gitignore
└── README.md
```

---

## Pruebas

### Backend (Jest)

**Ejecutar tests:**

```bash
cd backend
npm test                 # Ejecuta todos los tests
npm test -- --watch     # Modo watch
npm test -- --coverage  # Con cobertura
```

**Escribir un test:**

```typescript
// usuario.test.ts
import Usuario from '../models/Usuario';

describe('Usuario', () => {
  it('debe crear un usuario con email válido', async () => {
    const usuario = await Usuario.create({
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@unq.edu.ar',
      password: 'hash_password',
      rol: 'user'
    });
    
    expect(usuario.email).toBe('juan@unq.edu.ar');
    expect(usuario.rol).toBe('user');
  });
});
```

### Frontend

- Por ahora no hay tests automatizados
- Se bienvenida una PR agregando tests con **Vitest** o **Jest**

---

## Proceso de pull request

### Antes de crear el PR

1. **Actualiza tu rama desde develop:**

```bash
git fetch origin
git rebase origin/develop
```

2. **Ejecuta linter y tests:**

```bash
# Backend
cd backend && npm run lint && npm test

# Frontend
cd frontend && npm run lint
```

3. **Verifica en desarrollo:**
   - Frontend carga sin errores
   - Backend responde correctamente
   - Funcionalidad nueva funciona como se espera

### Crear el PR

En GitHub:

1. Clic en **New Pull Request**
2. Base: `develop`, Comparar: `tu-rama`
3. Rellena el template:

```markdown
## Descripción
Breve resumen de los cambios.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Cambio de documentación

## Cambios principales
- Punto 1
- Punto 2

## Testing realizado
Describe las pruebas que hiciste:
- [ ] Test 1
- [ ] Test 2

## Screenshots (si aplica)
Adjunta imágenes si es un cambio visual.

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He probado mi código localmente
```

### Revisión

- Mantén la rama actualizada mientras se revisa
- Responde a los comentarios constructivamente
- Realiza los cambios solicitados en nuevos commits

---

## Contribuciones específicas

### Agregar una nueva funcionalidad

1. Crea rama `feature/nombre`
2. **Backend:**
   - Crea modelo en `src/models/` (si es necesario)
   - Implementa lógica en `src/controllers/`
   - Define rutas en `src/routes/`
   - Documenta en Swagger (JSDoc comments)
3. **Frontend:**
   - Crea componentes en `src/components/`
   - Actualiza `src/services/api.ts` si se necesitan endpoints nuevos
   - Crea página si es necesario
4. Crea PR con descripción detallada

### Reportar un bug y proponer fix

1. Reporta el bug en un issue (si no existe)
2. Crea rama `bugfix/nombre-del-bug`
3. Implementa el fix
4. Agrega test (si es posible)
5. Crea PR referenciando el issue: `Fixes #123`

### Mejorar documentación

1. Crea rama `docs/cambio`
2. Edita archivos `.md` en `docs/`
3. Revisa la sintaxis Markdown
4. Crea PR

---

## Contacto y preguntas

- **Issues en GitHub:** para bugs y features
- **Discusiones:** para preguntas generales (si está habilitado)
- **Email:** contacta a los maintainers del proyecto

---

## Agradecimientos

Gracias por contribuir a mejorar el Sistema de Inventario UNQ. Cada contribución, grande o pequeña, es valorada.

**¡Esperamos tu PR! 🚀**
