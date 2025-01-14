const { ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { parseEther } = require("ethers/lib/utils")
const prompt = require("prompt-sync")()

let tokenId = prompt("TokenId: ")

async function placeBid() {
    const abstractImpulseNFT = await ethers.getContract("AbstractImpulseNFT")

    console.log(`Working With AbstractImpulseNFT Contract: ${abstractImpulseNFT.address} Owner: ${await abstractImpulseNFT.owner()}`)

    //  MinValue Of Bid is 0.5
    const responseTx = await abstractImpulseNFT.placeBid(tokenId, { value: parseEther("0.5") })
    const receiptTx = await responseTx.wait()
    const bidVal = receiptTx.events[1].args.amount
    const bidder = receiptTx.events[1].args.bidder
    const token = receiptTx.events[1].args.tokenId
    const time = receiptTx.events[0].args.time

    console.log(`NFT With TokenId: ${token} New Bid Amount: ${bidVal} Received!`)
    console.log(`New Highest Bidder: ${bidder}`)
    console.log(`Auction Time Left For This NFT: ${time}`)
}

if (!developmentChains.includes(network.name)) {
    placeBid()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error)
            process.exit(1)
        })
} else {
    console.log("This script is allowed only for Goerli, Sepolia or Mainnet")
}
