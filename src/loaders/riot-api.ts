import RiotAPI from '../models/riot-api';
import config from '../config/riot-config';

RiotAPI.init(config.apiKey, config.maxRequest, config.maxRequestMinute);
