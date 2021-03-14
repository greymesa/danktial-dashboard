const discordRouter = require('express').Router();

discordRouter.get('/', (req, res) => {
    res.redirect('/dashboard/auth/discord');
});

module.exports = discordRouter;