import { Router } from 'express';
import Summoner from '../services/data/summoner';

const router = Router();

router.use(function timeLog(req, res, next) {
  console.log('Summoner / Time: ', Date.now());
  next();
});

router.get('/:name', function (req, res) {
  Summoner.get(req.params.name)
    .then((data) => {
      res.status(data === null ? 404 : 200);
      res.json(data);
    })
    .catch(() => {
      res.status(500);
      res.send('오류가 발생했습니다.');
    });
});

export default router;
