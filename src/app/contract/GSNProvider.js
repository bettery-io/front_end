import { GSNProvider } from "@openzeppelin/gsn-provider";
import Web3 from 'web3';

const getGSNProvider = async () => {
    let gsnWeb3 = new Web3(new GSNProvider("https://rpc-mumbai.matic.today"));
    let accounts = await gsnWeb3.eth.getAccounts();
    return { gsnWeb3: gsnWeb3, accounts: accounts[0] }
}

export default getGSNProvider;