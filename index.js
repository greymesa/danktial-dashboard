require('dotenv').config();
require('./strategies/discord');

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Database = require('./database');
const app = express();
const routes = require('./routes');
const SQLiteStore = require('./database/sqlite-session')(session);

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use(session({
    secret: process.env.CLIENT_SECRET,
    cookie: {
        maxAge: 60000 * 60 * 24,
    },
    expires: 60000 * 60 * 24,
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({
        db: 'cache'
    }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.get('*', (req, res) => {
    res.redirect('/dashboard');
});
app.listen(3002, () => {
    console.log('[ONLINE] Listening to port 3002');
    Database.db();
});
