require('dotenv').config();
const express = require('express');
const sequelize = require('./database');
const createError = require('http-errors');
const router = require('./routes/index');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const logger = require('./utils/logger');
const {swaggerDocs, swaggerUi} = require('./utils/swaggerConfig');

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api/v1', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(function(req, res, next) {
    next(createError(404));
  });
  
  app.use(function(err, req, res, next) {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(err.status || 500).json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});


const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => logger.info(`SERVER STARTED ON PORT ${PORT}`));
    } catch (e) {
        logger.error(e);
    }
}

start();
