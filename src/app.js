"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// /var/www/RestAPI/src/app.ts
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var envResult = dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
var express_1 = require("express");
var cors_1 = require("cors");
var menuRoutes_1 = require("./routes/menuRoutes");
var db_1 = require("./config/db");
var swagger_ui_express_1 = require("swagger-ui-express");
var swagger_1 = require("./config/swagger");
var imageRoutes_1 = require("./routes/imageRoutes");
var app = (0, express_1.default)();
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.specs));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', menuRoutes_1.default);
app.use('/api/images', imageRoutes_1.default);
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
var PORT = process.env.PORT || 3002;
if (require.main === module) {
    (0, db_1.connectToDatabase)()
        .then(function () {
        app.listen(PORT, function () {
            console.log("Server is running on port ".concat(PORT));
        });
    })
        .catch(function (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}
exports.default = app;
