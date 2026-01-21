-- 1. Tabla de Categorías (Debe ir primero por las dependencias)
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion_uso VARCHAR(255),
    tipo_uso VARCHAR(255),
    color VARCHAR(50),
    icono VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL, -- Administrador o Docente
    email VARCHAR(255) UNIQUE NOT NULL,
    area VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Equipos
CREATE TABLE equipos (
    id SERIAL PRIMARY KEY,
    id_categoria INT REFERENCES categorias(id) ON DELETE SET NULL,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(255),
    modelo VARCHAR(255),
    nro_serie VARCHAR(255) UNIQUE,
    estado_operativo VARCHAR(50) DEFAULT 'Disponible', -- Disponible, Prestado, Mantenimiento
    nro_patrimonio VARCHAR(255),
    observaciones TEXT,
    propietario VARCHAR(255),
    codigo VARCHAR(255) UNIQUE, -- Para el código QR
    patrimonio_unq BOOLEAN DEFAULT TRUE,
    imagen_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Préstamos (Relaciona usuarios y equipos físicos)
CREATE TABLE prestamos (
    id SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id),
    id_equipo INT REFERENCES equipos(id),
    id_responsable_entrega INT REFERENCES usuarios(id),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP,
    fecha_devolucion TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'Pendiente', -- Pendiente, Activo, Devuelto, Rechazado
    observaciones TEXT,
    motivo_rechazo TEXT,
    observaciones_devolucion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Mantenimientos
CREATE TABLE mantenimientos (
    id SERIAL PRIMARY KEY,
    id_equipo INT REFERENCES equipos(id),
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    repuestos VARCHAR(255),
    descripcion_falla TEXT,
    responsable VARCHAR(255),
    estado VARCHAR(50), -- En Reparación, Reparado, Baja
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);