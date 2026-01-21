# Sistema de Gestión de Inventario
## Laboratorio de Informática - Universidad Nacional de Quilmes

**Documento de Proyecto**  
**Versión**: 1.0  
**Fecha**: Enero 2026  
**Desarrollador**: [Tu Nombre]  
**Destinatario**: Universidad Nacional de Quilmes

---

## RESUMEN EJECUTIVO

Este documento describe el desarrollo de un **Sistema Web de Gestión de Inventario** para el Laboratorio de Informática de la Universidad Nacional de Quilmes. El sistema digitaliza completamente el proceso de préstamo de equipamiento informático (notebooks, proyectores, herramientas), reemplazando el método manual actual basado en papel.

### Beneficios Principales
- ✅ Control en tiempo real del inventario y préstamos
- ✅ Trazabilidad completa de equipos y responsables
- ✅ Reducción del tiempo administrativo en un 80%
- ✅ Generación automática de reportes y métricas
- ✅ Prevención de pérdidas y conflictos de disponibilidad
- ✅ Acceso desde cualquier dispositivo con navegador web

### Información del Proyecto
- **Plazo de desarrollo**: 40 días
- **Costo**: $0 (desarrollo donado a la universidad)
- **Licencia**: Código abierto (MIT License)
- **Hosting**: Gratuito (Vercel + Railway)
- **Mantenimiento futuro**: A cargo de la universidad

---

## 1. INTRODUCCIÓN

### 1.1 Contexto Actual

El Laboratorio de Informática de la UNQ gestiona diariamente préstamos de equipamiento a docentes y áreas de la universidad. El proceso actual involucra:

- Registro manual en planillas de papel
- Falta de visibilidad del estado del inventario
- Dificultad para rastrear equipos prestados
- Imposibilidad de generar reportes o estadísticas
- Riesgo de superposición de préstamos
- Tiempo excesivo en tareas administrativas

### 1.2 Propuesta de Solución

Desarrollar un **sistema web moderno y fácil de usar** que permita:

**Para docentes:**
- Solicitar equipos de forma rápida y simple
- Ver el estado de sus solicitudes
- Consultar su historial de préstamos

**Para el personal del laboratorio:**
- Gestionar el inventario completo
- Aprobar o rechazar solicitudes
- Registrar entregas y devoluciones
- Ver métricas y reportes en tiempo real
- Planificar la disponibilidad de equipos

### 1.3 Alcance del Sistema

**Incluye:**
- Gestión completa de inventario
- Sistema de solicitudes y aprobaciones
- Control de préstamos activos
- Sistema de reservas
- Registro de mantenimientos
- Dashboard con métricas
- Reportes exportables
- Códigos QR para agilizar procesos

**No incluye (en esta versión):**
- Integración con sistemas de la universidad (SIU Guaraní, etc.)
- App móvil nativa (funciona desde el navegador)
- Sistema de multas o penalizaciones
- Integración con control de acceso físico

---

## 2. USUARIOS DEL SISTEMA

### 2.1 Administradores del Laboratorio

**Quiénes son:**
- Personal técnico del laboratorio
- Responsables de la gestión del inventario

**Qué pueden hacer:**
- Gestionar el inventario completo (equipos, categorías)
- Revisar y aprobar/rechazar solicitudes
- Registrar entregas y devoluciones
- Marcar equipos en mantenimiento
- Ver reportes y métricas
- Administrar usuarios del sistema
- Exportar información a Excel

### 2.2 Docentes

**Quiénes son:**
- Profesores de la universidad
- Responsables de cátedras o proyectos

**Qué pueden hacer:**
- Solicitar equipos por categoría de uso
- Ver el estado de sus solicitudes
- Consultar su historial de préstamos
- Reservar equipos para fechas futuras

---

## 3. FUNCIONALIDADES PRINCIPALES

### 3.1 Gestión de Inventario

El sistema permite administrar todo el equipamiento del laboratorio de forma centralizada:

- **Registro de equipos**: Cada equipo tiene código único, categoría, marca, modelo, número de serie, estado físico
- **Categorización**: Los equipos se organizan por tipo de uso (Ofimática, Programación, Diseño, Proyectores, etc.)
- **Estado del equipo**: Disponible, prestado, en mantenimiento, dado de baja
- **Patrimonio**: Distinción entre equipos de la universidad y externos (de docentes, otras instituciones)
- **Historial completo**: Registro de todos los préstamos realizados por equipo
- **Códigos QR**: Cada equipo tiene un código QR único para identificación rápida

### 3.2 Sistema de Préstamos

#### Flujo desde el punto de vista del docente:

1. **Solicitud**: El docente ingresa al sistema, selecciona la categoría de equipo que necesita (ej: Notebook para Programación) y completa el formulario indicando:
   - Motivo del préstamo
   - Fecha estimada de devolución
   
2. **Espera de aprobación**: La solicitud queda en estado "Pendiente"

3. **Notificación**: El docente puede ver el estado de su solicitud (Aprobada, Rechazada, Entregada)

4. **Retiro y devolución**: Coordinado con el personal del laboratorio

#### Flujo desde el punto de vista del administrador:

1. **Recepción de solicitud**: El sistema muestra todas las solicitudes pendientes

2. **Revisión**: El administrador revisa disponibilidad y decide aprobar o rechazar

3. **Entrega**: Cuando el docente retira el equipo, el administrador:
   - Escanea el código QR del equipo (o lo busca manualmente)
   - Marca como "Entregado"
   - El equipo queda registrado como no disponible

4. **Devolución**: Cuando el docente devuelve el equipo, el administrador:
   - Escanea el código QR
   - Registra el estado en que se devolvió (excelente, bueno, dañado, etc.)
   - Añade observaciones si es necesario
   - El equipo vuelve a estar disponible

#### Estados de un préstamo:

- **Pendiente**: Solicitado, esperando decisión
- **Aprobado**: Aprobado pero no retirado aún
- **Rechazado**: Solicitud denegada (con motivo)
- **Entregado**: Equipo en poder del docente
- **Devuelto**: Equipo retornado al laboratorio

### 3.3 Sistema de Reservas

Permite reservar equipos para fechas futuras, incluso si están actualmente prestados:

- El docente puede reservar un equipo para un rango de fechas
- El sistema valida que no haya conflictos con otros préstamos/reservas
- El administrador confirma o cancela la reserva
- Cuando llega la fecha, la reserva se convierte en préstamo

**Ejemplo de uso:**  
*"Necesito un proyector para mi clase del viernes 25. Todos están prestados hoy, pero puedo reservar uno que se devuelve el jueves 24."*

### 3.4 Gestión de Mantenimiento

El sistema permite registrar cuando un equipo está en reparación o mantenimiento:

- **Tipos de mantenimiento**: Preventivo, correctivo, reparación
- **Información registrada**: Descripción del problema, fecha de inicio, fecha estimada de finalización, costo, responsable (técnico/proveedor)
- **Estado**: En proceso o completado
- **Efecto**: Mientras está en mantenimiento, el equipo no aparece como disponible

**Ejemplo de uso:**  
*"Una notebook se devolvió con la pantalla rota. La marco en mantenimiento, registro que se envió al service técnico, y cuando vuelva reparada la marco como completada."*

### 3.5 Dashboard y Reportes

#### Dashboard Principal (Administradores)

Vista rápida del estado actual del laboratorio:

- Cantidad de equipos disponibles vs prestados
- Solicitudes pendientes de aprobar
- Préstamos vencidos (no devueltos a tiempo)
- Equipos en mantenimiento
- Gráficos de ocupación por categoría

#### Reportes Disponibles

1. **Equipos más prestados**: Ranking de equipos con mayor demanda
2. **Préstamos por categoría**: Distribución de uso por tipo de equipo
3. **Docentes más activos**: Quiénes solicitan más equipos
4. **Timeline de préstamos**: Evolución de préstamos en el tiempo
5. **Estado del inventario**: Panorama general (disponible/prestado/mantenimiento)
6. **Tasa de ocupación**: % de equipos en uso por categoría
7. **Préstamos por área**: Distribución por departamento/cátedra
8. **Equipos sin uso**: Equipos que nunca se prestaron
9. **Historial por equipo**: Todos los préstamos de un equipo específico

**Exportación:** Todos los reportes se pueden exportar a Excel para análisis externo.

### 3.6 Códigos QR

Cada equipo tiene un código QR único que se puede:

- **Imprimir**: Pegar físicamente en el equipo
- **Escanear**: Con la cámara del celular o una webcam
- **Acción rápida**: Al escanear, abre directamente la ficha del equipo para entregar/devolver

**Beneficio:** Reduce el tiempo de entrega/devolución de varios minutos a pocos segundos.

---

## 4. TECNOLOGÍAS UTILIZADAS

### 4.1 Tecnologías Principales

El sistema está desarrollado con tecnologías modernas, gratuitas y de código abierto:

**Frontend (Interfaz de Usuario):**
- **React**: Librería de JavaScript para interfaces interactivas
- **TypeScript**: JavaScript con tipos, para mayor seguridad y mantenibilidad
- **Tailwind CSS**: Framework de estilos para diseño moderno y responsive

**Backend (Servidor):**
- **Node.js**: Entorno de ejecución de JavaScript en el servidor
- **Express**: Framework web minimalista y flexible
- **TypeScript**: Mismo lenguaje que en el frontend, facilita el mantenimiento

**Base de Datos:**
- **PostgreSQL**: Sistema de base de datos relacional robusto y confiable
- **Sequelize**: ORM (Object-Relational Mapping) para facilitar las consultas

**Otras Herramientas:**
- **JWT**: Sistema de autenticación seguro
- **Nodemailer**: Envío de notificaciones por email
- **QRCode**: Generación de códigos QR
- **Recharts**: Gráficos interactivos
- **XLSX**: Exportación a Excel

### 4.2 Ventajas de estas Tecnologías

✅ **Gratuitas**: No hay costos de licenciamiento  
✅ **Modernas**: Stack muy demandado, fácil encontrar desarrolladores  
✅ **Documentadas**: Abundante documentación y comunidad  
✅ **Escalables**: Permiten crecer el sistema en el futuro  
✅ **Multiplataforma**: Funcionan en Windows, Mac, Linux  
✅ **Compatibles**: Funcionan en cualquier navegador moderno  

### 4.3 Requisitos Técnicos

**Para usar el sistema (usuarios):**
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet
- Opcional: Cámara (para escanear códigos QR)

**Para mantener el sistema (administración técnica):**
- Conocimientos básicos de Node.js y React
- Acceso a la base de datos PostgreSQL
- Acceso a los servidores de hosting

---

## 5. ARQUITECTURA DEL SISTEMA

### 5.1 Diagrama General

```
┌─────────────────┐
│   NAVEGADOR     │ (Chrome, Firefox, etc.)
│   (Frontend)    │
└────────┬────────┘
         │ Internet
         │ (HTTPS)
┌────────▼────────┐
│   SERVIDOR      │ (Node.js + Express)
│   (Backend)     │
└────────┬────────┘
         │
┌────────▼────────┐
│  BASE DE DATOS  │ (PostgreSQL)
│   (Inventario)  │
└─────────────────┘
```

### 5.2 Modelo de Datos

El sistema maneja las siguientes entidades principales:

**Usuarios**
- Datos personales (nombre, email, área)
- Rol (Administrador o Docente)
- Credenciales de acceso

**Equipos**
- Código único de inventario
- Información técnica (marca, modelo, serie)
- Categoría de uso
- Estado físico y disponibilidad
- Información de patrimonio

**Préstamos**
- Equipo prestado
- Usuario que solicitó
- Fechas (solicitud, aprobación, entrega, devolución)
- Estados y observaciones
- Administrador responsable

**Reservas**
- Equipo reservado
- Usuario
- Rango de fechas
- Estado (pendiente, confirmada, cancelada)

**Mantenimientos**
- Equipo en servicio
- Tipo de mantenimiento
- Fechas y costos
- Responsable técnico

**Categorías**
- Nombre (Ofimática, Programación, etc.)
- Descripción del uso
- Icono y color (para identificación visual)

### 5.3 Relaciones entre Entidades

```
Usuario ──► solicita ──► Préstamo ──► de un ──► Equipo
                            │
                            └──► aprueba ──► Administrador

Equipo ──► pertenece a ──► Categoría

Equipo ──► puede tener ──► Reservas

Equipo ──► puede estar en ──► Mantenimiento

Préstamo ──► genera ──► Historial
```

---

## 6. SEGURIDAD Y PRIVACIDAD

### 6.1 Medidas de Seguridad Implementadas

✅ **Contraseñas encriptadas**: Nunca se almacenan en texto plano  
✅ **Autenticación JWT**: Tokens seguros con expiración  
✅ **Validación de datos**: Todos los inputs son validados  
✅ **Protección contra inyección SQL**: Uso de ORM  
✅ **CORS configurado**: Solo dominios autorizados  
✅ **HTTPS**: Comunicación encriptada  

### 6.2 Privacidad de Datos

- Los datos personales se usan únicamente para la gestión de préstamos
- No se comparten con terceros
- Los docentes solo ven sus propios préstamos
- Los administradores tienen acceso completo (necesario para la gestión)
- El historial se mantiene para trazabilidad

### 6.3 Roles y Permisos

**Docentes pueden:**
- ✅ Ver equipos disponibles
- ✅ Solicitar préstamos
- ✅ Ver sus propias solicitudes
- ✅ Ver su historial
- ❌ No pueden ver datos de otros docentes
- ❌ No pueden acceder al inventario completo
- ❌ No pueden aprobar solicitudes

**Administradores pueden:**
- ✅ TODO lo que pueden los docentes
- ✅ Gestionar inventario completo
- ✅ Aprobar/rechazar solicitudes
- ✅ Ver todos los préstamos
- ✅ Generar reportes
- ✅ Administrar usuarios

---

## 7. INSTALACIÓN Y DESPLIEGUE

### 7.1 Hosting Actual

El sistema está desplegado en servicios gratuitos:

- **Frontend**: Vercel (https://vercel.com)
- **Backend**: Railway (https://railway.app)
- **Base de datos**: Railway PostgreSQL

**URLs de acceso:**
- Sistema: `https://inventario-unq.vercel.app` (ejemplo)
- API: `https://inventario-unq-api.railway.app` (ejemplo)

### 7.2 Costos

**Actualmente:** $0/mes (planes gratuitos)

**Si el tráfico crece (muchos usuarios simultáneos):**
- Vercel Pro: ~USD 20/mes
- Railway Pro: ~USD 20/mes
- **Total estimado:** ~USD 40/mes (opcional, solo si es necesario)

### 7.3 Mantenimiento Futuro

#### Mantenimiento Regular (Recomendado)

**Mensual:**
- Verificar que el sistema esté funcionando
- Revisar logs de errores
- Hacer backup de la base de datos

**Semestral:**
- Actualizar dependencias de seguridad
- Revisar y limpiar datos antiguos si es necesario

**Anual:**
- Actualizar versiones mayores de tecnologías
- Evaluar nuevas funcionalidades

#### Soporte Técnico

El código está documentado y el repositorio incluye:
- Manual de instalación
- Guía de contribución
- Documentación de la API
- Diagramas y arquitectura

**Para mantenimiento futuro se recomienda:**
- Contar con un desarrollador con conocimientos de Node.js y React
- Alternativamente, contratar un freelancer ocasionalmente
- O bien, formar a personal técnico de la universidad

---

## 8. GUÍA DE USO

### 8.1 Para Docentes

#### Primer Acceso
1. Recibir credenciales del administrador del laboratorio
2. Ingresar a `https://inventario-unq.vercel.app`
3. Iniciar sesión con email y contraseña

#### Solicitar un Equipo
1. En la pantalla principal, ver las categorías disponibles
2. Hacer click en la categoría deseada (ej: "Notebook Programación")
3. Ver los equipos disponibles de esa categoría
4. Hacer click en "Solicitar"
5. Completar:
   - Motivo del préstamo
   - Fecha estimada de devolución
6. Enviar solicitud
7. Esperar aprobación del administrador

#### Ver Mis Solicitudes
- En "Mis Solicitudes" se ven todas las solicitudes con su estado
- Estados posibles:
  - **Pendiente** ⏳: Esperando aprobación
  - **Aprobado** ✓: Aprobado, coordinar retiro
  - **Rechazado** ✗: No aprobado (ver motivo)
  - **Entregado** 📦: Equipo retirado, en tu poder
  - **Devuelto** ↩️: Devuelto al laboratorio

#### Reservar para el Futuro
1. Ir a "Reservas"
2. Buscar el equipo deseado
3. Seleccionar rango de fechas
4. Enviar reserva
5. Esperar confirmación del administrador

### 8.2 Para Administradores

#### Gestionar Solicitudes Pendientes
1. En el Dashboard, ver cantidad de solicitudes pendientes
2. Click en "Gestionar Solicitudes"
3. Ver lista de solicitudes con información del docente y equipo
4. Opciones:
   - **Aprobar**: El docente podrá retirar el equipo
   - **Rechazar**: Indicar motivo del rechazo

#### Registrar Entrega de Equipo
**Opción 1: Con Código QR (Rápido)**
1. Escanear el código QR del equipo
2. El sistema abre la ficha del equipo
3. Click en "Entregar"
4. Confirmar

**Opción 2: Manual**
1. Ir a "Préstamos Activos"
2. Buscar el préstamo aprobado
3. Click en "Registrar Entrega"
4. Confirmar

**Efecto:** El equipo queda marcado como "Entregado" y no disponible.

#### Registrar Devolución de Equipo
**Opción 1: Con Código QR (Rápido)**
1. Escanear el código QR del equipo
2. Click en "Devolver"
3. Indicar estado del equipo (excelente, bueno, dañado, etc.)
4. Añadir observaciones si es necesario
5. Confirmar

**Opción 2: Manual**
1. Ir a "Préstamos Activos"
2. Buscar el préstamo entregado
3. Click en "Registrar Devolución"
4. Completar información y confirmar

**Efecto:** El equipo vuelve a estar disponible (salvo que se marque en mantenimiento).

#### Agregar un Nuevo Equipo
1. Ir a "Inventario"
2. Click en "Agregar Equipo"
3. Completar formulario:
   - Código de inventario (único)
   - Nombre descriptivo
   - Categoría
   - Marca, modelo, número de serie
   - Estado físico
   - Patrimonio (UNQ o externo)
4. Guardar
5. Imprimir código QR y pegarlo en el equipo físico

#### Marcar Equipo en Mantenimiento
1. Buscar el equipo en "Inventario"
2. Click en "Mantenimiento"
3. Completar:
   - Tipo (preventivo, correctivo, reparación)
   - Descripción del problema
   - Fecha estimada de finalización
   - Responsable (técnico/proveedor)
   - Costo (opcional)
4. Guardar

**Efecto:** El equipo no aparece como disponible hasta que se marque como reparado.

#### Ver Reportes
1. Ir a "Reportes"
2. Seleccionar el reporte deseado
3. Aplicar filtros si es necesario (fechas, categorías, etc.)
4. Ver gráficos y tablas
5. Opcional: Exportar a Excel

---

## 9. PREGUNTAS FRECUENTES

**¿Qué pasa si se va la luz o internet?**  
El sistema está en la nube, por lo que necesita internet para funcionar. Si se cae internet temporalmente, los datos quedan guardados en el servidor y se pueden consultar cuando vuelva la conexión.

**¿Se pueden perder los datos?**  
No, si se hacen backups regulares de la base de datos (recomendado: semanalmente). Railway permite hacer backups automáticos.

**¿Cuántos usuarios pueden usar el sistema simultáneamente?**  
Con el plan gratuito, hasta ~100 usuarios simultáneos sin problemas. Si se necesita más, se puede escalar fácilmente.

**¿Funciona en celulares?**  
Sí, la interfaz es responsive y funciona en celulares, tablets y computadoras.

**¿Se puede modificar el sistema en el futuro?**  
Sí, el código es de la universidad y se puede modificar libremente. Está documentado para facilitar cambios futuros.

**¿Qué pasa con los datos cuando finaliza el período de gracia de los planes gratuitos?**  
Se recomienda migrar a planes pagos (bajo costo) o bien hospedar en servidores propios de la universidad. Toda la data se puede exportar.

**¿Hay límite de equipos o préstamos?**  
No, se pueden registrar tantos equipos y préstamos como sea necesario.

**¿Los docentes pueden eliminar sus solicitudes?**  
Pueden cancelarlas si están pendientes. Una vez aprobadas o entregadas, solo los administradores pueden modificarlas.

**¿Se puede integrar con el sistema SIU Guaraní?**  
En esta versión no, pero es técnicamente posible en el futuro si se desarrolla una API de integración.

---

## 10. ROADMAP FUTURO (Posibles Mejoras)

Este es un MVP (Producto Mínimo Viable) funcional. Posibles mejoras futuras:

### Corto Plazo (3-6 meses)
- [ ] App móvil nativa (Android/iOS)
- [ ] Notificaciones push
- [ ] Integración con calendario (Google Calendar, Outlook)
- [ ] Sistema de comentarios/chat en préstamos
- [ ] Firma digital al recibir/devolver

### Mediano Plazo (6-12 meses)
- [ ] Integración con SIU Guaraní
- [ ] Sistema de multas/penalizaciones automático
- [ ] Panel de métricas avanzado (BI)
- [ ] API pública para integraciones
- [ ] Módulo de compras/adquisiciones

### Largo Plazo (1-2 años)
- [ ] Integración con control de acceso físico (torniquetes, puertas)
- [ ] Machine Learning para predecir demanda
- [ ] App de escritorio offline
- [ ] Multi-laboratorio (varios laboratorios en una sola plataforma)

---

## 11. LICENCIA Y PROPIEDAD

### 11.1 Propiedad Intelectual

El código fuente y sistema completo es **donado a la Universidad Nacional de Quilmes** sin costo alguno. La universidad tiene todos los derechos para:

- ✅ Usar el sistema indefinidamente
- ✅ Modificar el código
- ✅ Agregar nuevas funcionalidades
- ✅ Compartir con otras instituciones
- ✅ Crear versiones derivadas

### 11.2 Licencia

El proyecto se entrega bajo **Licencia MIT**, que permite:

```
Copyright (c) 2026 Universidad Nacional de Quilmes

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una 
copia de este software y archivos de documentación asociados (el "Software"), 
para utilizar el Software sin restricciones, incluyendo sin limitación los 
derechos de usar, copiar, modificar, fusionar, publicar, distribuir, 
sublicenciar, y/o vender copias del Software.
```

### 11.3 Atribución

Se solicita (no es obligatorio) que se mantenga la referencia al desarrollador original en:
- Documentación del código
- Pantalla "Acerca de" del sistema
- README del repositorio

---

## 12. AGRADECIMIENTOS Y CONTACTO

### 12.1 Desarrollo

**Desarrollador**: [Tu Nombre]  
**Email**: [Tu Email]  
**LinkedIn**: [Tu Perfil]  
**GitHub**: github.com/[tu-usuario]/inventario-unq

### 12.2 Universidad

**Institución**: Universidad Nacional de Quilmes  
**Laboratorio**: Laboratorio de Informática  
**Área**: [Área correspondiente]

### 12.3 Agradecimientos

- A la Universidad Nacional de Quilmes por la oportunidad
- Al equipo del laboratorio por la colaboración y feedback
- A la comunidad de código abierto por las herramientas utilizadas

---

## 13. ANEXOS

### Anexo A: Glosario de Términos

- **API**: Application Programming Interface - Interfaz que permite la comunicación entre sistemas
- **Backend**: Parte del sistema que corre en el servidor (no visible para el usuario)
- **Base de datos**: Sistema que almacena información de forma estructurada
- **Frontend**: Parte del sistema que el usuario ve e interactúa (interfaz visual)
- **Hosting**: Servicio de alojamiento en internet
- **JWT**: JSON Web Token - Sistema de autenticación seguro
- **ORM**: Object-Relational Mapping - Facilita el trabajo con bases de datos
- **QR**: Quick Response - Código de barras 2D que se puede escanear
- **Responsive**: Diseño que se adapta a diferentes tamaños de pantalla
- **Stack**: Conjunto de tecnologías usadas en un proyecto

### Anexo B: Estructura del Repositorio

```
inventario-unq/
├── backend/               # Código del servidor
│   ├── src/              # Código fuente
│   ├── docs/             # Documentación técnica
│   └── README.md         # Guía de instalación
├── frontend/             # Código de la interfaz
│   ├── src/              # Código fuente
│   ├── public/           # Archivos públicos
│   └── README.md         # Guía de instalación
├── database/             # Scripts de base de datos
│   ├── schema.sql        # Estructura de tablas
│   └── seeders.sql       # Datos de ejemplo
├── docs/                 # Documentación general
│   ├── manual-usuario.pdf
│   ├── manual-tecnico.pdf
│   └── guia-mantenimiento.pdf
├── LICENSE               # Licencia MIT
└── README.md             # Información general del proyecto
```

### Anexo C: Recursos Adicionales

**Documentación oficial de tecnologías:**
- Node.js: https://nodejs.org/docs
- React: https://react.dev
- PostgreSQL: https://www.postgresql.org/docs
- Express: https://expressjs.com

**Tutoriales recomendados:**
- TypeScript: https://www.typescriptlang.org/docs
- Sequelize: https://sequelize.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

**Comunidades de ayuda:**
- Stack Overflow (español): https://es.stackoverflow.com
- GitHub Discussions del proyecto
- Foros de Node.js Argentina

---

**FIN DEL DOCUMENTO**

*Este documento es un entregable del proyecto y forma parte de la documentación oficial del Sistema de Gestión de Inventario de la Universidad Nacional de Quilmes.*

*Versión 1.0 - Enero 2026*