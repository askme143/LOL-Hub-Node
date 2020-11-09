import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const champStatSchema = new Schema({
  reducedName: String,
  name: String,
  puuid: String,
  champion: Number,
  kill: Number,
  death: Number,
  assist: Number,
  win: Number,
  loose: Number,
  gameMode: Number,
  season: Number,
});

export default {
  ChampStat: mongoose.model('champ-stat', champStatSchema),
};
