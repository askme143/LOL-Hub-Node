/* Loader */
import './loaders';

import express from 'express';
import * as Router from './routes';

import config from './config/server-config';

const app = express();
app.use(express.json());

app.use('/api/summoner', Router.SummonerRouter);
app.use('/api/update', Router.UpdateRouter);

app.listen(config.port, () => {
  console.log(`App is listening on port ${config.port}`);
});

export default app;
