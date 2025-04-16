import { Router } from 'express';
import { getShopStatus } from '../utils/shop.utils';

const router = Router();

router.get('/', (_req, res) => {
  const shopStatus = getShopStatus();
  res.render('index', { statusMessage: shopStatus.message });
});

export default router;
