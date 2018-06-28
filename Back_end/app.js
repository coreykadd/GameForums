require('./config/config'); //Init config variables
require('./global_functions'); //Init global functions

console.log('Environment: ', CONFIG.app);

// Variables
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');

const v1 = require('./routes/v1');
const cors = require('cors');
const app = express();
const customMiddleware = require('./middleware/custom.middleware');
const tokenMiddleware = require('./middleware/token.middleware');

// Uses
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

// Passport
app.use(passport.initialize());

// Database
const models = require('./models');
models.sequelize.authenticate().then(() => {
    console.log('Connected to SQL database: ', CONFIG.db_name);
}).catch(err => {
    console.error('Unable to connect to SQL database: ', CONFIG.db_name, err);
});

if (CONFIG.app === 'dev' || CONFIG.app === 'test') {
    models.sequelize.sync(); // Creates table of they do no already exist
    // models.sequelize.sync({force: true}); // Deleted all tables, then recreates them
};

// Route and error handling
app.use('/v1', v1);

app.use('/', function (req, res) {
    res.statusCode = 404;
    res.json({
        status: 'success',
        message: 'Parcel Pending API',
        data: {}
    });
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'developmeny' ? err : {};

    return ReE(res, err, 500);
});

module.exports = app;