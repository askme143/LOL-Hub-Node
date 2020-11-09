import { Router } from 'express';
import { Container } from 'typedi';
import SummonerService from '../../services/summoner-service';

const router = Router();
const Summoner = Container.get(SummonerService);

router.use(function timeLog(req, res, next) {
  console.log('Summoner / Time: ', Date.now());
  next();
});

router.get('/:name', function (req, res) {
  Summoner.getSummoner(req.params.name)
    .then((data) => {
      if (data === null) {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      res.send('오류가 발생했습니다.');
    });
});

router.get('/:name/profile', function (req, res) {
  res.end();
});

router.get('/:name/champ-stat/:', function (req, res) {
  res.end();
});

export default router;
