const discordRouter = require('express').Router();

discordRouter.get('/', (req, res) => {
    res.send(200);
});

module.exports = discordRouter;