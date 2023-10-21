import { Router } from 'express';
import { handleValidationErrors, loginValidator, registerValidator, updateValidator } from '../utils/validations.js';
import { UserController } from '../controllers/index.js';
import checkAuth from '../utils/checkAuth.js';
//=========================================================================================================================
const router = new Router();

router.post('/register', registerValidator, handleValidationErrors, UserController.register);
router.post('/login', loginValidator, handleValidationErrors, UserController.login);
router.get('/me', checkAuth, UserController.getMe);
router.get('/activate/:link', UserController.activate);
router.post('/update', checkAuth, updateValidator, handleValidationErrors, UserController.update);

export default router;
