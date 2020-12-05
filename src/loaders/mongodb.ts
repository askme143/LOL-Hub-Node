import mongoose from 'mongoose';
import config from '../config/mongo-config';

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log('Mongod server와 연결');
});

mongoose
  .connect(
    `mongodb://${config.mongoUser}:${config.mongoPassword}@${config.mongoIP}:${config.mongoPort}/lol-hub-node?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('mongodb connected');
  });
