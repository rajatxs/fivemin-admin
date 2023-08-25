import express from 'express';
import routes from '../routes/root.js';
import { PORT } from '../config.js';

/** @type {express.Express|null} */
var app = null;

/** @type {import('http').Server|null} */
var server = null;

/**
 * Starts new HTTP server instance
 * @returns {Promise<void>}
 */
export function startHTTPServer() {
   return new Promise((resolve, reject) => {
      if (app || server) {
         return resolve();
      }

      app = express();
      app.set('view engine', 'ejs');
      app.use(express.static('public'));
      app.use(express.urlencoded({ extended: false }));
      app.use(routes);
      server = app.listen(PORT);

      if (server) {
         server.on('listening', resolve);
         server.on('error', reject);
      }
   })
}

/**
 * Stops active HTTP server instance
 * @returns {Promise<void>}
 */
export function stopHTTPServer() {
   return new Promise((resolve, reject) => {
      if (server) {
         server.close((err) => {
            if (err) {
               reject(err);
            } else {
               app = null;
               server = null;
               resolve();
            }
         })
      } else {
         resolve();
      }
   });
}
