const router = require('express').Router();
const userController = require('../controller/user.controller');
const { authenticateJWT } = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', authenticateJWT, userController.logout);
router.put('/update', authenticateJWT, userController.update);
router.get('/user-info', authenticateJWT, userController.getUserInfo);

module.exports = router;
