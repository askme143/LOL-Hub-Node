import RiotAPI from '../services/riot-api';
import config from '../config/riot-config';

RiotAPI.init(config.apiKey, config.maxRequestSec, config.maxRequestMin);
