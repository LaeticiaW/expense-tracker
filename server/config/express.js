var config = require('./config'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    flash = require('connect-flash');

module.exports = function() {

    var app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(bodyParser.urlencoded({extended: true}));

    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.set('views', './server/views');
    app.set('view engine', 'ejs');

    app.use(flash());

    require('../routes/index.routes.js')(app);
    require('../routes/category.routes.js')(app);
    require('../routes/expense.routes.js')(app);
    require('../routes/report.routes.js')(app);
    require('../routes/home.routes.js')(app);
    require('../routes/import.routes.js')(app);
    require('../routes/category-mapping.routes.js')(app);

    app.use(express.static('./client'));

    return app;
};

