import Redis from "ioredis";

// const client = redis.createClient ({
//   url : 'redis://apn1-immense-collie-33899.upstash.io:33899',
//   password: '9aeb07f7211946faa7c441bc35dc0d32',
// });

export const client = new Redis("rediss://:9aeb07f7211946faa7c441bc35dc0d32@apn1-immense-collie-33899.upstash.io:33899", { maxRetriesPerRequest: 0 });
