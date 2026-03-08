# NVRS Project Structure

## Overview

Node Virtual Restaurant Solutions (NVRS) - TypeScript/Node.js backend with Express.js framework.

## Directory Structure

```
NVRS/
├── LICENSE
├── assets/
│   └── beer.jpg
├── clean-build.sh
├── dist/                           # Compiled JavaScript output
│   ├── app.js
│   ├── config/
│   │   ├── db.js                   # Database configuration
│   │   └── swagger.js              # API documentation setup
│   ├── controllers/
│   │   ├── imageController.js      # Image upload/retrieval logic
│   │   └── menuController.js       # Menu CRUD operations
│   ├── models/
│   │   └── menuItem.js             # Menu item data model
│   ├── routes/
│   │   ├── imageRoutes.js          # Image API endpoints
│   │   └── menuRoutes.js           # Menu API endpoints
│   ├── scripts/
│   │   ├── generateDocs.js         # OpenAPI documentation generator
│   │   └── insertImage.js          # Database image utility
│   └── services/
│       └── menuService.js          # Business logic layer
├── docs/
│   └── openapi.json                # API specification
├── package-lock.json               # Dependency lock file
├── package.json                    # Project dependencies & scripts
├── src/                            # TypeScript source code
│   ├── app.ts                      # Main application entry point
│   ├── config/
│   │   ├── db.ts                   # Database configuration
│   │   └── swagger.ts              # API documentation setup
│   ├── controllers/
│   │   ├── imageController.ts      # Image upload/retrieval logic
│   │   ├── menuController.ts       # Menu CRUD operations
│   │   └── paymentController.ts    # Payment processing logic
│   ├── models/
│   │   └── menuItem.ts             # Menu item data model
│   ├── routes/
│   │   ├── imageRoutes.ts          # Image API endpoints
│   │   └── menuRoutes.ts           # Menu API endpoints
│   ├── scripts/
│   │   ├── generateDocs.ts         # OpenAPI documentation generator
│   │   └── insertImage.ts          # Database image utility
│   └── services/
│       └── menuService.ts          # Business logic layer
├── tsconfig.json                   # TypeScript configuration
└── uploads/                        # File upload directory
```

## Key Directories

### `/src` - Source Code

- **Primary development directory** containing all TypeScript source files
- Organized using MVC pattern with clear separation of concerns

### `/dist` - Compiled Output

- **Production-ready JavaScript** compiled from TypeScript source
- Mirror structure of `/src` directory
- Generated automatically during build process

### `/docs` - Documentation

- **API Documentation** and project specifications
- Contains OpenAPI/Swagger JSON specification

### `/uploads` - File Storage

- **Image uploads** from menu item management
- Runtime directory for file uploads

## Architecture Notes

**Technology Stack:**

- **Backend**: Node.js + Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **Documentation**: OpenAPI/Swagger
- **Build System**: TypeScript Compiler

**Project Pattern:**

- **MVC Architecture** (Model-View-Controller)
- **Service Layer** for business logic
- **RESTful API** design
- **Image Management** with file upload capabilities

## Build Process

- Source TypeScript files in `/src`
- Compiled to JavaScript in `/dist`
- Build script: `clean-build.sh`

**Total Files:** 30 files across 17 directories
