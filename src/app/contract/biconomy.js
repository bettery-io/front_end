import Biconomy from "@biconomy/mexa";
import {biconomyKey} from '../config/keys'

const biconomyInit = async () => {
    let biconomy = new Biconomy("https://rpc-mumbai.matic.today",
        {
            apiKey: biconomyKey,
            strictMode: true
        });
    await BiconomyReady(biconomy);
    window.biconomy = biconomy;
}

async function BiconomyReady(biconomy) {
    return new Promise(function (resolve, reject) {
        return biconomy
            .onEvent(biconomy.READY, async () => {
                resolve()
            })
            .onEvent(biconomy.ERROR, (error, message) => {
                reject(error);
            });
    });
}

export default biconomyInit;


