const router = require('express').Router();
const messageController = require('../controller/message.controller');
const { authenticateJWT } = require('../middleware/auth');
router.post('/send', authenticateJWT, messageController.sendMessage);
router.get('/conversation', authenticateJWT, messageController.getMessages);
module.exports = router;
