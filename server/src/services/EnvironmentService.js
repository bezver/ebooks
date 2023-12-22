class EnvironmentService {
  constructor() {
    this.port = process.env.PORT;
    this.allowedOrigin = process.env.ALLOWED_ORIGIN;
    this.mongoServerUrl = process.env.MONGO_SERVER_URL;
    this.mongoDbName = process.env.MONGO_DB_NAME;
  }
}

export const envService = new EnvironmentService();
