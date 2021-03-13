const authRouter = require('express').Router();
const passport = require('passport');

authRouter.get('/discord', passport.authenticate('discord'));
authRouter.get('/discord/redirect', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.send(200);
    console.log('got redirected');
});

module.exports = authRouter;