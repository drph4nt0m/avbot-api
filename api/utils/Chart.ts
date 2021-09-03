import Mongo from './Mongo';
import ChartResponse from '../interfaces/ChartResponse';

export default class Chart {
  private icao: string;

  constructor(icao: string) {
    this.icao = icao;
  }

  async getChart(): Promise<ChartResponse> {
    return new Promise(async (resolve, reject) => {
      const mongoClient = await new Mongo().getClient();
      const charts = mongoClient.db('avbot').collection('charts');
      charts.findOne({ icao: this.icao }, (error, chartsRes) => {
        if (error) {
          reject('500');
        }
        if (!chartsRes) {
          reject('404');
        }
        resolve(chartsRes as ChartResponse);
      });
    });
  }
}
