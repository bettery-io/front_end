import ethUtils from 'ethereumjs-util'
import getMaticPOSClient from './getMaticPOSClient';
import BN from 'bn.js';
import Proofs from './libs/ProofsUtil'


async function buildPayloadForExit(burnTxHash, from, web3) {
    const logSignature = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

    let maticPOS = await getMaticPOSClient(from);
    let web3Client = maticPOS.web3Client;
    let network = new maticPOS.network.__proto__.constructor("testnet", 'mumbai')
    console.log(network)
    let option = {
        network: network,
        rootChain: '0x2890bA17EfE978480615e330ecB65333b880928e',

    }
    let rootChain = new maticPOS.rootChain.__proto__.constructor(option, web3Client)
    let lastBlock = await rootChain.getLastChildBlock()
    console.log(lastBlock)
    let burnTx = await web3Client.getMaticWeb3().eth.getTransaction(burnTxHash)
    console.log(burnTx);
    const receipt = await web3Client.getMaticWeb3().eth.getTransactionReceipt(burnTxHash)
    console.log(receipt);
    const block = await web3Client
        .getMaticWeb3()
        .eth.getBlock(burnTx.blockNumber, true /* returnTransactionObjects */)
    console.log(block)
    const headerBlockNumber = await rootChain.findHeaderBlockNumber(burnTx.blockNumber);
    console.log(headerBlockNumber)

    const headerBlock = await web3Client.call(
        rootChain.rootChain.methods.headerBlocks(encode(headerBlockNumber))
    )
    console.log(headerBlock);

    const blockProof = await Proofs.buildBlockProof(
        web3Client.getMaticWeb3(),
        parseInt(headerBlock.start, 10),
        parseInt(headerBlock.end, 10),
        parseInt(burnTx.blockNumber + '', 10)
    )

    console.log(blockProof)

    const receiptProof = await Proofs.getReceiptProof(receipt, block, web3Client.getMaticWeb3())
    console.log(receiptProof)

    const logIndex = receipt.logs.findIndex(log => log.topics[0].toLowerCase() == logSignature.toLowerCase())
    console.log(logIndex)

    return _encodePayload(
        headerBlockNumber,
        blockProof,
        burnTx.blockNumber,
        block.timestamp,
        Buffer.from(block.transactionsRoot.slice(2), 'hex'),
        Buffer.from(block.receiptsRoot.slice(2), 'hex'),
        Proofs.getReceiptBytes(receipt), // rlp encoded
        receiptProof.parentNodes,
        receiptProof.path,
        logIndex
    )
}

function _encodePayload(
    headerNumber,
    buildBlockProof,
    blockNumber,
    timestamp,
    transactionsRoot,
    receiptsRoot,
    receipt,
    receiptParentNodes,
    path,
    logIndex
) {
    return ethUtils.bufferToHex(
        ethUtils.rlp.encode([
            headerNumber,
            buildBlockProof,
            blockNumber,
            timestamp,
            ethUtils.bufferToHex(transactionsRoot),
            ethUtils.bufferToHex(receiptsRoot),
            ethUtils.bufferToHex(receipt),
            ethUtils.bufferToHex(ethUtils.rlp.encode(receiptParentNodes)),
            ethUtils.bufferToHex(ethUtils.rlp.encode(path)),
            logIndex,
        ])
    )
}

function encode(number) {
    if (typeof number === 'number') {
        number = new BN(number)
    } else if (typeof number === 'string') {
        if (number.slice(0, 2) === '0x') return number
        number = new BN(number)
    }
    if (BN.isBN(number)) {
        return '0x' + number.toString(16)
    }
}

export default buildPayloadForExit