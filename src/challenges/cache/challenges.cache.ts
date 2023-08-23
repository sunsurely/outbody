import * as NodeCache from 'node-cache';
export const cache = new NodeCache({ stdTTL: 86400 }); // 24h
