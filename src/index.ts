/* Loader */
import './loaders';

import app from './api/server';
import config from './config/server-config';

app.listen(config.port, () => {
  console.log(`App is listening on port ${config.port}`);
});
