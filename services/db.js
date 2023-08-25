import { MongoClient } from 'mongodb'
import { DB_URL, DB_NAME } from '../config.js'
import log from '../utils/log.js'

/** @type {import('mongodb').MongoClient|null} */
var _client = null

/** Returns reference of active database instance */
export function db(){
   // @ts-ignore
   return _client.db(DB_NAME)
}

/** Returns reference of `posts` collection */
export function postCollection() {
   // @ts-ignore
   return _client.db(DB_NAME).collection('posts')
}

/** Establish database connection */
export async function connect() {
   if (_client) {
      return
   }

   _client = new MongoClient(DB_URL)
   await _client.connect()
}

/** Closes active database connection */
export async function disconnect() {
   if (!_client) {
      return
   }

   try {
      await _client.close(false)
      _client = null
   } catch (error) {
      log.error('Failed to close database connection', error)
      return
   }
}
