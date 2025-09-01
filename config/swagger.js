const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Load base OpenAPI document
const baseOpenApi = require('../docs/swagger.json');

/**
 * Build the OpenAPI spec by combining the base JSON
 * with JSDoc annotations from files in the docs folder.
 */
function buildOpenApiSpec() {
  const apisGlob = [
    path.join(__dirname, '..', 'docs', '**', '*.swagger.js')
  ];
  const swaggerSpec = swaggerJSDoc({
    definition: baseOpenApi,
    apis: apisGlob
  });

  // Ensure security is applied globally if provided
  if (baseOpenApi.security && !swaggerSpec.security) {
    swaggerSpec.security = baseOpenApi.security;
  }

  return swaggerSpec;
}

/**
 * Mount Swagger UI and serve the generated spec.
 * @param {import('express').Express} app
 */
function setupSwagger(app) {
  const spec = buildOpenApiSpec();

  // Serve raw JSON at /api-docs.json
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(spec);
  });

  // Serve Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec, {
    explorer: true
  }));
}

module.exports = { setupSwagger };


