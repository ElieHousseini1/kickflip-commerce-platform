process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "sqlite::memory:";
process.env.AUTH_SECRET =
  "test-secret-that-is-longer-than-thirty-two-characters";
process.env.CORS_ORIGINS = "http://localhost:3000";
process.env.LOG_LEVEL = "silent";
