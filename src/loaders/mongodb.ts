import mongoose from 'mongoose';
import config from '../config/mongo-config';

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log('Mongod server와 연결');
});

mongoose.connect(
  `mongodb://${config.mongoUser}:${config.mongoPassword}@localhost:27017/lol-hub-node?authSource=admin&readPreference=primary&ssl=false`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
