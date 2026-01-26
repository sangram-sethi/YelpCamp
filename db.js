const mongoose = require('mongoose');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

// Cache connection for warm serverless + prevents re-connecting too often
let cached = global.__mongooseCache;
if (!cached) {
  cached = global.__mongooseCache = { conn: null, promise: null };
}

function maskMongoUrl(url) {
  if (!url) return url;
  return url.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
}

async function connectDB() {
  console.log('[mongo] DB_URL seen by app =', maskMongoUrl(dbUrl));

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(dbUrl).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectDB, dbUrl };

