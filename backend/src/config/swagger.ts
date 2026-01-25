import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Inventario ESET-UNQ',
      version: '1.0.0',
    },
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
  // Esto busca en la carpeta donde esté el proceso ejecutándose, 
  // sin importar si es src o dist.
  apis: ['./src/routes/*.ts','./dist/routes/*.js'], 
};

export const swaggerSpec = swaggerJSDoc(options);