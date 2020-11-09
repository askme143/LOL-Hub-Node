//Loading
import '../loaders/mongodb';
import SummonerRouter from './routes/Summoner';

import express from 'express';

const app = express();

app.use('/api/summoner', SummonerRouter);

export default app;
