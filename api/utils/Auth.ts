import Mongo from './Mongo';
// import AuthDocument from '../interfaces/AuthDocument';

export default class Auth {
  private apikey: string;

  constructor(apikey: string) {
    this.apikey = apikey;
  }

  async isValid(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const mongoClient = await new Mongo().getClient();
      const api = mongoClient.db('avbot').collection('api');
      api.findOne({ apikey: this.apikey }, (error, apiRes) => {
        if (error) {
          reject('500');
        }
        if (!apiRes) {
          reject(false);
        }
        resolve(true);
      });
    });
  }
}
