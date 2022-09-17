import axios from 'axios';
import { CronJob } from 'cron';

export const getBTCPrice = async () => {
    try {
        const { data } = await axios.get('https://chain.so/api/v2/get_price/BTC/USD');
        return data['data']['prices'][0]['price'];
    } catch(e) {
        try {
            const { data } = await axios.get('https://data.messari.io/api/v1/assets/btc/metrics');
            return data['data']['market_data']['price_usd'];
        } catch(e) {
            return false;
        }
    }
}

export const createCronJob = async (runner: () =>{}) => {
    const cronJob: CronJob = new CronJob('0 */3 * * * *', async () => {
        await runner();
    });
    return cronJob;
}