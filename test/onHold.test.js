const Quize = artifacts.require('./contracts/Quize.sol');
const Token = artifacts.require('./contracts/LoomERC20Coin.sol')
const Web3 = require("web3");
const BigNumber = require('bignumber.js');

contract('onHold', (accounts) => {
    const web = new Web3();
    const ethPrice = web.utils.toWei("13280", "ether");
    var quizeAddress;

    const id = 12345;
    const startTime = Number(Math.floor(Date.now() / 1000).toFixed(0));
    const date1 = new Date().setMinutes(new Date().getMinutes() + 1)
    const endTime = Number(Math.floor(date1 / 1000).toFixed(0));
    const persentHost = 0;
    const percentValidator = 0;
    const questionQuantity = 2;
    const validatorsAmount = 3;
    const quizePrice = web3.utils.toWei("0.1", 'ether');

    beforeEach(async () => {
        quize = await Quize.deployed();
        token = await Token.deployed();
    })


    it('Should have an address for Quize', async () => {
        quizeAddress = quize.address;
        assert(quize.address)
    });

    it("Set Eth price must work only with admin account", async () => {
        await quize.setEthPrice(ethPrice, ethPrice, { from: accounts[1] }).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
        })
    })

    it("Set ETH price", async () => {
        await quize.setEthPrice(ethPrice, ethPrice, { from: accounts[0] })

        let data = await quize.priceEth();
        let price = new BigNumber(data)
        assert(price == "13280", 'price not equal');
    })

    it("Should have an 0 eth on hold account", async () => {
        let price = await quize.onHold();
        assert(price == "0", 'on hold balance is not 0');
    })

    it("Should have correct value on hold balance", async () => {
        let amount = await quize.moneyRetentionCalculate(true);
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
            let amount = await quize.moneyRetentionCalculate(true);
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

    it("Send coins on hold contract from another account", async () => {
        let amount = await quize.moneyRetentionCalculate(true, { from: accounts[1] });
        await quize._setMoneyRetention(
            1234,
            true,
            {
                from: accounts[1],
                value: amount
            }
        )
        let balance = await quize.onHold({ from: accounts[1] });
        assert(balance.toString() == "75301204819277100", 'on hold balance is not equal');
        let secondBalance = await quize.onHold({ from: accounts[0] });
        assert(secondBalance.toString() != balance, "Balances from different accounts must be not equal")
    })

    it("Recieve coins to second account", async () => {
        await quize.getMoneyRetention(
            accounts[1],
            {
                from: accounts[0]
            }
        )
        let balance = await quize.onHold({ from: accounts[1] });
        assert(balance.toString() == "0", "Balance is not 0")
    })

    it("Check guard of tokens", async () => {
        let data = await quize.amountGuard(true);
        assert(data.toString() == "0", "Balance is not correct")
    })

    it("Set token on hold account", async () => {
        let getTokenBalanceBefore = await quize.getContractTokenBalance();
        let amount = await quize.moneyRetentionCalculate(false);
        await token.approve(quizeAddress, amount)

        await quize.startQestion(
            (id + 1),
            startTime,
            endTime,
            persentHost,
            percentValidator,
            questionQuantity,
            validatorsAmount,
            quizePrice,
            false,
            {
                from: accounts[0],
                value: 0
            }
        )

        let getTokenBalanceAfter = await quize.getContractTokenBalance();
        assert(getTokenBalanceAfter.toString() > getTokenBalanceBefore.toString(), "The contract does not receive tokens")
    })

    it("Get token retention back", async () => {
        await quize.getMoneyRetention(accounts[0]);
        let getTokenBalance = await quize.getContractTokenBalance();
        assert(getTokenBalance.toString() == "0", "Money still on balance")
    })

    it("On hold token from second account", async () => {
        let amount = web.utils.toWei("1", "ether")
        await token.transfer(accounts[1], amount);
        await token.approve(quizeAddress, amount, {from: accounts[1]})
        await quize.startQestion(
            (id + 10),
            startTime,
            endTime,
            persentHost,
            percentValidator,
            questionQuantity,
            validatorsAmount,
            quizePrice,
            false,
            {
                from: accounts[1],
                value: 0
            }
        )

        await quize.getMoneyRetention(accounts[1]);

        let contractBalanceAfter = await quize.getContractTokenBalance();
        assert(contractBalanceAfter.toString() == "0", "Conract balance must be 0")
    })
})