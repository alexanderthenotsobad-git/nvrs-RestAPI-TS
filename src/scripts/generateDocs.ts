// src/scripts/generateDocs.ts
import fs from 'fs';
import path from 'path';
import { specs } from '../config/swagger';

const outputPath = path.join(__dirname, '../../docs');

// Create docs directory if it doesn't exist
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}

// Write the OpenAPI specification to a JSON file
fs.writeFileSync(
    path.join(outputPath, 'openapi.json'),
    JSON.stringify(specs, null, 2),
    'utf8'
);

console.log('OpenAPI documentation generated successfully in /docs/openapi.json');