import { Router } from 'express';
import Update from '../../services/update';

const router = Router();

router.use(function timeLog(req, res, next) {
  console.log('Update / Time: ', Date.now());
  next();
});

router.post('/', function (req, res) {
  Update.update(req.body.name)
    .then((success) => {
      if (!success) {
        res.status(404);
      } else {
        res.status(200);
      }

      res.send();
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
      res.send('오류가 발생했습니다.');
    });
});

export default router;
