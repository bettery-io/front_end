import MetamaskProvider from "@maticnetwork/metamask-provider"

// enable ethereum metamask
//window.ethereum.enable()

// create ropsten provider
const goerliProvider = (new MetamaskProvider(window.ethereum, {
    url: "https://goerli.infura.io/v3/2b5ec85db4a74c8d8ed304ff2398690d"
})
)

// create matic testnet provider
const maticTestnetProvider = (new MetamaskProvider(window.ethereum, {
    url: "https://rpc-mumbai.matic.today"
})
)


export { goerliProvider, maticTestnetProvider }