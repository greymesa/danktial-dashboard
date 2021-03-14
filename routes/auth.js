const authRouter = require('express').Router();
const passport = require('passport');

authRouter.get('/discord', (req, res) => {
    res.redirect(process.env.REDIRECT_URL.replace('{CLIENT_ID}', process.env.CLIENT_ID));
});
authRouter.get('/discord/redirect', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.send(200);
    console.log('got redirected');
});
authRouter.get('/', (req, res) => {
    if (req.user[0]) {
        const data = JSON.parse(req.user[0].data);
        res.send(data);
    } else {
        res.status(401).send('Unauthorized!');
    }
});

module.exports = authRouter;