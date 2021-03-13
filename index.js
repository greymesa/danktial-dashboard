require('dotenv').config();
require('./strategies/discord');

const express = require('express');
const passport = require('passport');
const app = express();
const routes = require('./routes');
app.use(express.json());

app.use('/dashboard', routes);

app.use(passport.initialize());
app.use(passport.session());

app.listen(3002, () => {
    console.log('[ONLINE] Listening to port 3002');
});
