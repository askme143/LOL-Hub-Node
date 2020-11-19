//Loading
import '../loaders/mongodb';
import SummonerRouter from './routes/summoner';
import UpdateRouter from './routes/update';

import express from 'express';

const app = express();

app.use(express.json());

app.use('/api/summoner', SummonerRouter);
app.use('/api/update', UpdateRouter);

export default app;
