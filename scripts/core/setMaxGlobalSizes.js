const { getFrameSigner, deployContract, contractAt, sendTxn, readTmpAddresses, callWithRetries } = require("../shared/helpers")
const { bigNumberify, expandDecimals } = require("../../test/shared/utilities")
const { toChainlinkPrice } = require("../../test/shared/chainlink")

const network = (process.env.HARDHAT_NETWORK || 'pulse');
const tokens = require('./tokens')[network];

async function getArbValues() {
  const positionContracts = [
    "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868", // PositionRouter
    "0x75E42e6f01baf1D6022bEa862A28774a9f8a4A0C" // PositionManager
  ]

  const { btc, eth, link, uni } = tokens
  const tokenArr = [btc, eth, link, uni]

  return { positionContracts, tokenArr }
}

async function getAvaxValues() {
  const positionContracts = [
    "0xffF6D276Bc37c61A23f06410Dce4A400f66420f8", // PositionRouter
    "0xA21B83E579f4315951bA658654c371520BDcB866" // PositionManager
  ]

  const { avax, eth, btc, btcb } = tokens
  const tokenArr = [avax, eth, btc, btcb]

  return { positionContracts, tokenArr }
}

async function getCronosValues() {
  const positionContracts = [
    "0x898dECf055b9236F6E6062080bc5d11C958CfB0b", // PositionRouter
    "0x75be73dAB8EcF685DdA1701b23c12dBb8eDDf07b" // PositionManager
  ]

  const { cro, btc, eth, atom, ada, doge } = tokens
  const tokenArr = [cro, btc, eth, atom, ada, doge]

  return { positionContracts, tokenArr }
}

async function getButaneValues() {
  const positionContracts = [
    "0x4c18b32A41a03B01D3520b2Ae3bCf11a01e59BFD", // PositionRouter
    "0x92284DDFD7d7399cD5637Fb86749fAdDaCf25229" // PositionManager
  ]

  const { wbbc } = tokens
  const tokenArr = [wbbc]

  return { positionContracts, tokenArr }
}

async function getPulseValues() {
  const positionContracts = [
    "0xA83690a096D80393349e46659264f69F5F9bA820", // PositionRouter
    "0xAbf126E5F1AD0fd5E8C4eC02590e27C48A187A80" // PositionManager
  ]

  const { pls, btc, eth, plsx, inc } = tokens
  const tokenArr = [pls, btc, eth, plsx, inc]

  return { positionContracts, tokenArr }
}

async function getValues() {
  if (network === "arbitrum") {
    return getArbValues()
  }

  if (network === "avax") {
    return getAvaxValues()
  }

  if (network === "cronos") {
    return getCronosValues()
  }

  if (network === "butane") {
    return getButaneValues()
  }

  if (network === "pulse") {
    return getPulseValues()
  }
}

async function main() {
  const { positionContracts, tokenArr } = await getValues()

  console.log("Beast tokenArr = ", tokenArr)
  const tokenAddresses = tokenArr.map((t) => {
    return t.address
  })
  
  const longSizes = tokenArr.map((token) => {
    if (!token.maxGlobalLongSize) {
      return bigNumberify(0)
    }

    return expandDecimals(token.maxGlobalLongSize, 30)
  })

  const shortSizes = tokenArr.map((token) => {
    if (!token.maxGlobalShortSize) {
      return bigNumberify(0)
    }

    return expandDecimals(token.maxGlobalShortSize, 30)
  })

  for (let i = 0; i < positionContracts.length; i++) {
    const positionContract = await contractAt("PositionManager", positionContracts[i])
    await sendTxn(positionContract.setMaxGlobalSizes(tokenAddresses, longSizes, shortSizes), "positionContract.setMaxGlobalSizes")
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
