import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Inventario ESET-UNQ',
      version: '1.0.0',
      description: 'Documentación de la API para la gestión de inventario de equipos informáticos',
    },
    servers: [
      {
        url: 'https://inventario-eset-unq-production.up.railway.app',
        description: 'Servidor de Producción (Railway)',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido en /api/auth/login',
        },
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del usuario',
              example: 1,
            },
            nombre: {
              type: 'string',
              description: 'Nombre completo del usuario',
              example: 'Juan Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del usuario',
              example: 'juan@unq.edu.ar',
            },
            rol: {
              type: 'string',
              description: 'Rol del usuario en el sistema',
              enum: ['admin', 'usuario'],
              example: 'usuario',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del usuario',
            },
          },
        },
        Equipo: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del equipo',
              example: 1,
            },
            nombre: {
              type: 'string',
              description: 'Nombre o modelo del equipo',
              example: 'Laptop Dell Latitude 5420',
            },
            categoria: {
              type: 'string',
              description: 'Categoría del equipo',
              example: 'Laptop',
            },
            estado: {
              type: 'string',
              description: 'Estado actual del equipo',
              enum: ['disponible', 'prestado', 'mantenimiento'],
              example: 'disponible',
            },
            numero_serie: {
              type: 'string',
              description: 'Número de serie del equipo',
              example: 'SN123456789',
            },
            observaciones: {
              type: 'string',
              description: 'Observaciones adicionales',
              example: 'Equipo en buen estado',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de registro del equipo',
            },
          },
        },
        Prestamo: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del préstamo',
              example: 1,
            },
            id_equipo: {
              type: 'integer',
              description: 'ID del equipo prestado',
              example: 5,
            },
            id_usuario: {
              type: 'integer',
              description: 'ID del usuario que solicita el préstamo',
              example: 3,
            },
            estado: {
              type: 'string',
              description: 'Estado del préstamo',
              enum: ['pendiente', 'aprobado', 'rechazado', 'devuelto'],
              example: 'pendiente',
            },
            fecha_prestamo: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha en que se realizó el préstamo',
            },
            fecha_devolucion: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Fecha de devolución del equipo',
            },
            observaciones: {
              type: 'string',
              nullable: true,
              description: 'Observaciones del préstamo',
              example: 'Préstamo para proyecto de investigación',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error',
              example: 'Recurso no encontrado',
            },
          },
        },
      },
    },
  },
  apis: [
    './src/routes/*.ts',
    './dist/routes/*.js',
    './src/routes/**/*.ts',
    './dist/routes/**/*.js',
    './routes/*.js',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);