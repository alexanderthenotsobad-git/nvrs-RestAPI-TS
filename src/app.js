"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envResult = dotenv_1.default.config({
    path: path_1.default.join(__dirname, '../.env')
});
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const menuRoutes_1 = __importDefault(require("./routes/menuRoutes"));
const db_1 = require("./config/db");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'Menu API', version: '1.0.0' },
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Scan routes/controllers
};
const app = (0, express_1.default)();
const specs = (0, swagger_jsdoc_1.default)(options);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', menuRoutes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
const PORT = process.env.PORT || 3002;
if (require.main === module) {
    (0, db_1.connectToDatabase)()
        .then(() => {
        //console.log('MySQL Connection Successful');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
        .catch(error => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}
exports.default = app;
