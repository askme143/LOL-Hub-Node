import RiotAPI from '../services/utils/riot-api';
import config from '../config/riot-config';

RiotAPI.init(config.apiKey, config.maxRequestSec, config.maxRequestMinute);
