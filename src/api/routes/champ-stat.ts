import { Router } from 'express';
import ChampStat from '../../services/champ-stat';

const router = Router();

router.use(function timeLog(req, res, next) {
  console.log('Summoner / Time: ', Date.now());
  next();
});

router.get('/:name', function (req, res) {
  ChampStat.getChampStat(req.params.name)
    .then((data) => {
      if (data === null) {
        res.status(404);
      } else {
        res.status(200);
      }

      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
      res.send('오류가 발생했습니다.');
    });
});

export default router;
