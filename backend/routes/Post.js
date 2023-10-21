import { Router } from 'express';
import { CommentController, PostController } from '../controllers/index.js';
import checkAuth from '../utils/checkAuth.js';
import { handleValidationErrors, postCreateValidator } from '../utils/validations.js';
//=========================================================================================================================
const router = new Router();

router.get('/', PostController.getAll);
router.get('/:id', PostController.getOne);
router.post('/', checkAuth, postCreateValidator, handleValidationErrors, PostController.create);
router.delete('/:id', checkAuth, PostController.remove);
router.patch('/:id', checkAuth, postCreateValidator, handleValidationErrors, PostController.update);
router.get('/comments/:id', CommentController.getPostComments);

export default router;
