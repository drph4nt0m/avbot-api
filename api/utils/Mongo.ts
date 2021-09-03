import { MongoClient } from 'mongodb';

import services from '../config/services';

export default class Chart {
  private uri: string;

  private options;

  private client: MongoClient;

  private clientPromise: Promise<MongoClient>;

  constructor() {
    this.uri = services.mongodb.uri;
    this.options = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    };
  }

  private async connectClient(): Promise<void> {
    if (services.environment === 'development') {
      if (!global._mongoClientPromise) {
        this.client = new MongoClient(this.uri, this.options);
        global._mongoClientPromise = this.client.connect();
      }
      this.clientPromise = global._mongoClientPromise;
    } else {
      this.client = new MongoClient(this.uri, this.options);
      this.clientPromise = this.client.connect();
    }
  }

  public async getClient(): Promise<MongoClient> {
    if (!this.clientPromise) {
      await this.connectClient();
    }
    return this.clientPromise;
  }
}
