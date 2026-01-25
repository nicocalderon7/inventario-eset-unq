import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Inventario ESET-UNQ',
      version: '1.0.0',
      description: 'Documentación de la API para la gestión de inventario y préstamos',
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
        },
      },
    },
  },
  // Dónde buscar los comentarios para armar la doc
  apis: ['./src/routes/*.ts', 
  './dist/routes/*.js', 
  './routes/*.js'], 
};

export const swaggerSpec = swaggerJSDoc(options);