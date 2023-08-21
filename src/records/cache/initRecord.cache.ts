import * as NodeCache from 'node-cache';
export const recordCache = new NodeCache({ stdTTL: 2592000 });
