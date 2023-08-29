import algoliasearch from 'algoliasearch';
import { ALGOLIA_APP_ID, ALGOLIA_API_KEY } from '../config.js';

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

export const postIndex = client.initIndex('posts');
