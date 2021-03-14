const router = require('express').Router();
const auth = require('./auth');
const discord = require('./discord');
const dashboard = require('./dashboard');

router.use('/auth', auth);
router.use('/discord', discord);
router.use('/', dashboard);

module.exports = router;