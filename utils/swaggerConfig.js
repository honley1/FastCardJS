const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FastCard API Documentation',
            version: '1.0.0',
            description: 'FastCard is an innovative application for creating and using digital business cards with NFC technology, allowing you to instantly exchange contact information.',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local server'
            },
            {
                url: process.env.API_URL,
                description: 'Test server'
            }
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = {
    swaggerDocs,
    swaggerUi
};