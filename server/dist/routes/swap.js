import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createSwapRequest, respondToSwap, listRequests } from '../controllers/swapController.js';
const router = Router();
router.post('/swap-request', authMiddleware, createSwapRequest);
router.post('/swap-response/:requestId', authMiddleware, respondToSwap);
router.get('/requests', authMiddleware, listRequests);
export default router;
