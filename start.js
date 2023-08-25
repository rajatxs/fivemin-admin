import { startHTTPServer, stopHTTPServer } from './services/http.js';
import { connect, disconnect } from './services/db.js';
import { PORT } from './config.js';
import log from './utils/log.js';

async function terminate() {
   try {
      await disconnect();
      await stopHTTPServer();
      process.exit(0);
   } catch (error) {
      log.error('terminate', error);
      process.exit(1);
   }
}

;(async function() {
   process.on('SIGINT', terminate);
   process.on('SIGTERM', terminate);

   try {
      await connect();
   } catch (error) {
      log.error('db', error);
   }

   try {
      await startHTTPServer();
      log.info('server', 'running on port %d', PORT);
   } catch (error) {
      log.error('server', error);
   }
}());
