const passport = require('passport');
const DiscordStrategy = require('passport-discord');
const request = require('request');
const Database = require('../database');

passport.use(
    new DiscordStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        scope: ['identify', 'guilds'],
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('test');
    })
);