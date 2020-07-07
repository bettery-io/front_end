import Web3 from 'web3'
import Torus from '@toruslabs/torus-embed'

const web3Obj = {
    web3: new Web3(),
    torus: new Torus({}),
    setWeb3(provider) {
        let web3Instance = new Web3(provider)
        web3Obj.web3 = web3Instance
    },
    async initialize() {
        await web3Obj.torus.init({
            showTorusButton: true,
            buildEnv: 'production',
            network: {
                host: 'goerli',
                chainId: 5
            }
        })
        await web3Obj.torus.login({})
        web3Obj.setWeb3(web3Obj.torus.provider)
    }
}

export default web3Obj