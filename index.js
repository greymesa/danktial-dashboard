require('dotenv').config();
require('./strategies/discord');

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Database = require('./database');
const app = express();
const routes = require('./routes');
const SQLiteStore = require('./database/sqlite-session')(session);

app.use(express.json());
app.use(session({
    secret: process.env.CLIENT_SECRET,
    cookie: {
        maxAge: 60000 * 60 * 24,
    },
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({
        db: 'cache'
    }),
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.listen(3002, () => {
    console.log('[ONLINE] Listening to port 3002');
    Database.db();
});
