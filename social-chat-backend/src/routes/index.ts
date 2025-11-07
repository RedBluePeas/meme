import { Router } from 'express';

const router = Router();

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
