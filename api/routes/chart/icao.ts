import micro from 'micro-cors';
import Setup from '../../bootstrap/Setup';
import Chart from '../../utils/Chart';
import Auth from '../../utils/Auth';

new Setup();

const chartsApi = async (req, res): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  const {
    query: { icao, apikey },
    headers: { authorization },
  } = req;

  if (!apikey && !authorization) {
    return res.status(401).send({ error: '401', message: 'Missing API Key' });
  }

  try {
    await new Auth(apikey ? apikey : authorization).isValid();
  } catch (error) {
    return res.status(401).send({ error: '401', message: 'Invalid API Key' });
  }

  try {
    const chart = await new Chart(icao).getChart();
    const resData = {
      icao: chart.icao,
      country: chart.country,
      link: chart.link,
      source: chart.source,
      updatedAt: chart.updatedAt,
    };

    return res.send(resData);
  } catch (error) {
    if (error === '404') {
      return res.status(404).send({ error: '404', message: 'Chart not found' });
    } else {
      return res.status(500).send({ error: '500', message: 'Server error' });
    }
  }
};

const cors = micro();

export default cors(chartsApi);
