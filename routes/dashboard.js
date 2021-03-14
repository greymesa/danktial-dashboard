const router = require('express').Router();
const request = require('request');

const forceAuth = (req, res, next) => {
    if (!req.user || !req.user[0]) 
        return res.redirect('/dashboard/auth/discord')
    else return next();
}

router.get('/', (req, res) => {
    if (req.user && req.user[0]) {
        const user = JSON.parse(req.user[0].data);
        request.get({
            url: `http://www.destial.xyz:1025/api/discord/guilds`,
            headers: {
                "token": process.env.DISCORD_TOKEN
            },
            method: 'GET',
            json: true
        }, (err, r, body) => {
            const guilds = user.guilds.filter(b => body.find(g => b.id == g.id));
            const allowedGuilds = [];
            const promise = new Promise((resolve, reject) => {
                if (guilds.length === 0) resolve();
                for (const guild of guilds) {
                    request.get({
                        url: `http://www.destial.xyz:1025/api/discord/guilds/${guild.id}/members/${user.id}`,
                        headers: {
                            "token": process.env.DISCORD_TOKEN
                        },
                        method: 'GET',
                        json: true
                    }, (err, r, body) => {
                        if (body.hasPermission) {
                            allowedGuilds.push(guild);
                        }
                        if (guild === guilds[guilds.length - 1]) resolve();
                    });
                }
            });
            promise.then(() => {
                res.render('index', { pageTitle: 'Dashboard', user, guilds: allowedGuilds });
            })
        });
    } else {
        res.render('index', { pageTitle: 'Dashboard', user: null, guilds: null });
    }
});

router.get('/:guildID', forceAuth, (req, res, next) => {
    if (req.user && req.user[0]) {
        const user = JSON.parse(req.user[0].data);
        const { guildID } = req.params;
        if (guildID === 'me') {
            next()
        } else {
            request.get({
                url: `http://www.destial.xyz:1025/api/discord/guilds/${guildID}`,
                headers: {
                    "token": process.env.DISCORD_TOKEN,
                },
                method: 'GET',
                json: true
            }, (err, r, body) => {
                body.others = user.guilds.find(d => d.id === guildID);
                res.render('guild', { pageTitle: 'Dashboard', user, guild: body });
            });
        }
    }
}, (req, res) => {
    if (req.user && req.user[0]) {
        const user = JSON.parse(req.user[0].data);
        res.render('me', { pageTitle: 'Dashboard', user });
    }
});

module.exports = router;