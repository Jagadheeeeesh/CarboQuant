import CarbonCredit from './contracts/CarbonCredit.json';
import MarketPlace from './contracts/MarketPlace.json';

const options = {
    web3: {
        block: false,
        fallback: {
            type: 'http',
            url: 'http://127.0.0.1:9545'
        }
    },
    contracts: [
        CarbonCredit,
        MarketPlace
    ],
    polls: {
        accounts: 15000
    }
};

export default options;
