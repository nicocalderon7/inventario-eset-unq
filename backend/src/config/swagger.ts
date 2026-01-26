import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Inventario ESET-UNQ',
      version: '1.0.0',
      description: 'Documentación de la API para la gestión de inventario',
    },
    // Si no pones esto, el desplegable de "Servers" desaparece
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
        },
      },
    },
  },
  // Agregamos rutas más profundas para que encuentre los archivos sí o sí
  apis: [
    './src/routes/*.ts',
    './dist/routes/*.js',
    './src/routes/**/*.ts',
    './dist/routes/**/*.js',
    './routes/*.js'
  ],
};

export const swaggerSpec = swaggerJSDoc(options);