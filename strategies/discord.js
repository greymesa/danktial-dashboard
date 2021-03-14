const passport = require('passport');
const DiscordStrategy = require('passport-discord');
const Database = require('../database');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Database.all('SELECT * FROM users WHERE id=(?)', [id]);
        return user ? done(null, user) : done(null, null);
    } catch(err) {
        console.log(err);
        done(err, null);
    }
});

passport.use(
    new DiscordStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        scope: ['identify', 'guilds'],
    }, async (accessToken, refreshToken, profile, done) => {
        const { id, username, discriminator, avatar, guilds } = profile;
        const data = {
            id,
            username: `${username}#${discriminator}`,
            avatarHash: avatar,
            guilds,
        };
        Database.run(Database.getStatement('update'), [id, JSON.stringify(data)]);
        done(null, data);
    })
);