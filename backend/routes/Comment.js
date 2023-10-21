import { Router } from 'express';
import checkAuth from '../utils/checkAuth.js';
import { CommentController } from '../controllers/index.js';
//=========================================================================================================================
const router = new Router();

router.post('/:id', checkAuth, CommentController.createComment);
router.delete('/:id', checkAuth, CommentController.removeComment);

export default router;
