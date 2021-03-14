const authRouter = require('express').Router();
const passport = require('passport');

authRouter.get('/discord', passport.authenticate('discord'));

authRouter.get('/discord/redirect', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/dashboard');
});

authRouter.get('/', (req, res) => {
    if (req.user && req.user[0]) {
        res.redirect('/dashboard');
    } else {
        res.status(401).send('Unauthorized!');
    }
});

module.exports = authRouter;