const Quize = artifacts.require('./contracts/Quize.sol');
const Web3 = require("web3");

contract('Quize', (accounts) => {
    let quize
    let web3 = new Web3();
    let id = 12345;
    let startTime = Number(Math.floor(Date.now() / 1000).toFixed(0));
    let date1 = new Date().setMinutes(new Date().getMinutes() + 5)
    let endTime = Number(Math.floor(date1 / 1000).toFixed(0));
    let persentHost = 0;
    let percentValidator = 0;
    let questionQuantity = 2;
    let validatorsAmount = 3;
    let quizePrice = web3.utils.toWei("0.1", 'ether');

    beforeEach(async () => {
        quize = await Quize.deployed()
    })

    it('Should have an address for Quize', async () => {
        assert(quize.address)
    });

    it("Should have 1 estimate Ether for hold money", async () => {
        let amount = await quize.moneyRetentionCalculate();
        let toEther = Number(web3.utils.fromWei(amount, 'ether'));
        assert.equal(toEther, 1, "have no correct ether on hold contract");
    })

    it("Should have 0 Ether for hold money by id", async () => {
        let amount = await quize.getHoldMoneyById(id);
        let toEther = Number(web3.utils.fromWei(amount, 'ether'));
        assert.equal(toEther, 0, "have no correct ether on hold contract by id");
    })

    it('Should have a quize data', async () => {

        await quize.startQestion(
            id,
            startTime,
            endTime,
            persentHost,
            percentValidator,
            questionQuantity,
            validatorsAmount,
            quizePrice,
            {
                from: accounts[0],
                value: web3.utils.toWei("1", 'ether')
            }
        )

        let data = await quize.getQuestion(id);
        assert.equal(data.questionQuantity, questionQuantity, "Question quantity is not equal");
    })

    it("Should have 2 Ether for hold money", async () => {
        let amount = await quize.moneyRetentionCalculate();
        let toEther = Number(web3.utils.fromWei(amount, 'ether'));
        assert.equal(toEther, 2, "have no correct ether on hold contract");
    })

    it("Should have 1 Ether for hold money by id", async () => {
        let amount = await quize.getHoldMoneyById(id);
        let toEther = Number(web3.utils.fromWei(amount, 'ether'));
        assert.equal(toEther, 1, "have no correct ether on hold contract by id");
    })

    it('Trying to pass less amount of Ether that needed', async () => {

        await quize.startQestion(
            (id + 1),
            startTime,
            endTime,
            persentHost,
            percentValidator,
            questionQuantity,
            validatorsAmount,
            quizePrice,
            {
                from: accounts[0],
                value: web3.utils.toWei("1", 'ether')
            }
        ).catch((error)=>{
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
        })
    })

    

})