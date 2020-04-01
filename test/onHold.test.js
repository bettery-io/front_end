const Quize = artifacts.require('./contracts/Quize.sol');
const Web3 = require("web3");
const BigNumber = require('bignumber.js');

contract('onHold', (accounts) => {
    let web = new Web3();
    let ethPrice = web.utils.toWei("13280", "ether");

    beforeEach(async () => {
        quize = await Quize.deployed()
    })


    it('Should have an address for Quize', async () => {
        assert(quize.address)
    });

    it("Set Eth price must work only with admin account", async () => {
        await quize.setEthPrice(ethPrice, { from: accounts[1] }).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
        })
    })

    it("Set ETH price", async () => {
        await quize.setEthPrice(ethPrice, { from: accounts[0] })

        let data = await quize.priceEth();
        let price = new BigNumber(data)
        assert(price == "13280", 'price not equal');
    })

    it("Should have an 0 eth on hold account", async () => {
        let price = await quize.onHold();
        assert(price == "0", 'on hold balance is not 0');
    })

    it("Should have correct value on hold balance", async () => {
        let amount = await quize.moneyRetentionCalculate();
        await quize._setMoneyRetention(
            1234,
            true,
            {
                from: accounts[0],
                value: amount
            }
        )
        let balance = await quize.onHold();

        assert(amount.toString() == balance.toString(), 'on hold balance is not equal');
    })

    it("Send less that nedded on hold balance", async () => {
        await quize._setMoneyRetention(
            1234,
            true,
            {
                from: accounts[0],
                value: "1"
            }
        ).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
        })
    })

    it("Send 2 times more on hold balance and check coins balance", async () => {
        for (let i = 0; i < 2; i++) {
            let amount = await quize.moneyRetentionCalculate();
            await quize._setMoneyRetention(
                1234,
                true,
                {
                    from: accounts[0],
                    value: amount
                }
            )
        }

        let balance = await quize.onHold();
        let balanceContract = await quize.holdBalance();
        assert(balance.toString() == balanceContract.toString(), 'on hold balance is not equal');

    })

    it("Resieve money on hold account", async () => {
        await quize.getMoneyRetention(
            accounts[0],
            {
                from: accounts[0]
            }
        )
        let balance = await quize.onHold();
        let balanceContract = await quize.holdBalance();
        assert(balance.toString() == balanceContract.toString(), 'on hold balance is not equal');
    })

    it("Send coins on hold contract from another account", async()=>{
        let amount = await quize.moneyRetentionCalculate({from: accounts[1]});
        await quize._setMoneyRetention(
            1234,
            true,
            {
                from: accounts[1],
                value: amount
            }
        )
        let balance = await quize.onHold({from: accounts[1]});
        assert(balance.toString() == "75301204819277100" , 'on hold balance is not equal');
        let secondBalance = await quize.onHold({from: accounts[0]});
        assert(secondBalance.toString() != balance, "Balances from different accounts must be not equal")
    })

    it("Recieve coins to second account", async()=>{
        await quize.getMoneyRetention(
            accounts[1],
            {
                from: accounts[0]
            }
        )
        let balance = await quize.onHold({from: accounts[1]});
        assert(balance.toString() == "0", "Balance is not 0")
    })

    it("Check guard of tokens", async () =>{
        let data = await quize.amountGuard(false);
        assert(data.toString() == "1", "Balance is not corect")
    })

})