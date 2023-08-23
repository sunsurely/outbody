import * as NodeCache from 'node-cache';
export const followInitcache = new NodeCache({ stdTTL: 86400 }); // 24h
