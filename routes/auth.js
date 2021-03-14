const authRouter = require('express').Router();
const passport = require('passport');

authRouter.get('/discord', passport.authenticate('discord'));

authRouter.get('/discord/redirect', passport.authenticate('discord', {
    failureRedirect: '/dashboard'
}), (req, res) => {
    res.redirect('/dashboard');
});

authRouter.get('/', (req, res) => {
    res.redirect('/dashboard');
});

module.exports = authRouter;