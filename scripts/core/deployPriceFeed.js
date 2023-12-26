const { getFrameSigner, deployContract, contractAt , sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")

const network = (process.env.HARDHAT_NETWORK || 'pulse');
const tokens = require('./tokens')[network];

async function getArbValues() {
  const { btc, eth, usdc, link, uni, usdt, mim, frax, dai } = tokens
  const tokenArr = [btc, eth, usdc, link, uni, usdt, mim, frax, dai]
  const fastPriceTokens = [btc, eth, link, uni]

  const priceFeedTimelock = { address: "0x7b1FFdDEEc3C4797079C7ed91057e399e9D43a8B" }

  const updater1 = { address: "0x18eAc44875EC92Ed80EeFAa7fa7Ac957b312D366" }
  const updater2 = { address: "0x2eD9829CFF68c7Bb40812f70c4Fc06A4938845de" }
  const keeper1 = { address: "0xbEe27BD52dB995D3c74Dc11FF32D93a1Aad747f7" }
  const keeper2 = { address: "0x94577665926885f47ddC1Feb322bc51470daA8E8" }
  const updaters = [updater1.address, updater2.address, keeper1.address, keeper2.address]

  const tokenManager = { address: "0x2c247a44928d66041D9F7B11A69d7a84d25207ba" }

  const positionRouter = await contractAt("PositionRouter", "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868")

  const fastPriceEvents = await contractAt("FastPriceEvents", "0x4530b7DE1958270A2376be192a24175D795e1b07")
  // const fastPriceEvents = await deployContract("FastPriceEvents", [])

  const chainlinkFlags = { address: "0x3C14e07Edd0dC67442FA96f1Ec6999c57E810a83" }

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter,
    chainlinkFlags,
    tokenArr,
    updaters,
    priceFeedTimelock
  }
}

async function getAvaxValues() {
  const { avax, btc, btcb, eth, mim, usdce, usdc } = tokens
  const tokenArr = [avax, btc, btcb, eth, mim, usdce, usdc]
  const fastPriceTokens = [avax, btc, btcb, eth]

  const priceFeedTimelock = { address: "0x1273bD9042914386Adf8C7035AE1C49f787B1534" }

  const updater1 = { address: "0xd49807622a35fc4Cad9CCf6f811b2C0679fc0803" }
  const updater2 = { address: "0x5d2E4189d0b273d7E7C289311978a0183B96C404" }
  const keeper1 = { address: "0x5d2E4189d0b273d7E7C289311978a0183B96C404" }
  const keeper2 = { address: "0x5d2E4189d0b273d7E7C289311978a0183B96C404" }
  const updaters = [updater1.address, updater2.address, keeper1.address, keeper2.address]

  const tokenManager = { address: "0x9bf98C09590CeE2Ec5F6256449754f1ba77d5aE5" }

  const positionRouter = await contractAt("PositionRouter", "0xA8A8ef28cE7cDC25319f0E13fD8245F26caf8849")

  const fastPriceEvents = await deployContract("FastPriceEvents", [])
  // const fastPriceEvents = await contractAt("FastPriceEvents", "0x3ABC75fFf63a92F9b645e61393FCC15697506DE2")

  
  // const fastPriceEvents = await contractAt("FastPriceEvents", "0x02b7023D43bc52bFf8a0C54A9F2ecec053523Bf6", signer)

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter,
    tokenArr,
    updaters,
    priceFeedTimelock
  }
}

async function getGoerliValues() {
  const { btc, eth, usdc } = tokens
  const tokenArr = [btc, eth, usdc]
  const fastPriceTokens = [btc, eth]

  const priceFeedTimelock = { address: "0x579Dc20912550eeDe9a88c477D9ffd16dB7dD480" }

  const updater1 = { address: "0x5d2E4189d0b273d7E7C289311978a0183B96C404" }
  const updater2 = { address: "0x5d2E4189d0b273d7E7C289311978a0183B96C404" }
  const keeper1 = { address: "0x5d2E4189d0b273d7E7C289311978a0183B96C404" }
  const keeper2 = { address: "0x5d2E4189d0b273d7E7C289311978a0183B96C404" }
  const updaters = [updater1.address, updater2.address, keeper1.address, keeper2.address]

  const tokenManager = { address: "0x72fa790B516fFBCBBa7CD97815629053223dfB41" }

  const positionRouter = await contractAt("PositionRouter", "0xa0b9783C1cBf4096AC8D5876920855F333D58c2f")

  const fastPriceEvents = await deployContract("FastPriceEvents", [])
  // const fastPriceEvents = await contractAt("FastPriceEvents", "0x3ABC75fFf63a92F9b645e61393FCC15697506DE2")

  
  // const fastPriceEvents = await contractAt("FastPriceEvents", "0x02b7023D43bc52bFf8a0C54A9F2ecec053523Bf6", signer)

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter,
    tokenArr,
    updaters,
    priceFeedTimelock
  }
}

async function getCronosValues() {
  const { wcro, wbtc, weth, atom, ada, doge, dai, usdt, usdc } = tokens
  const tokenArr = [wcro, wbtc, weth, atom, ada, doge, dai, usdt, usdc]
  const fastPriceTokens = [wcro, wbtc, weth, atom, ada, doge]

  const priceFeedTimelock = { address: "0xD2C77F1af91527017b10290ae32b5B4FdB2Ce8Af" }

  const updater1 = { address: "0x5d2E4189d0b273d7E7C289311978a0183B96C404" }
  const updater2 = { address: "0x60ebaF4eEab2fEE16438fcec1fc1b9a58e57E21d" }
  const keeper1 = { address: "0x5d2E4189d0b273d7E7C289311978a0183B96C404" }
  const keeper2 = { address: "0x60ebaF4eEab2fEE16438fcec1fc1b9a58e57E21d" }
  const updaters = [updater1.address, updater2.address, keeper1.address, keeper2.address]

  const tokenManager = { address: "0x4038a0F91351A0C9168D293d86E8d10241BBaBe2" }

  const positionRouter = await contractAt("PositionRouter", "0x898dECf055b9236F6E6062080bc5d11C958CfB0b")

  // const fastPriceEvents = await deployContract("FastPriceEvents", [])
  const fastPriceEvents = await contractAt("FastPriceEvents", "0x6234e39c84F0AF2B437B32290324e11F23bE3E42")  
  // const fastPriceEvents = await contractAt("FastPriceEvents", "0x02b7023D43bc52bFf8a0C54A9F2ecec053523Bf6", signer)

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter,
    tokenArr,
    updaters,
    priceFeedTimelock
  }
}

async function getButaneValues() {
  const { wbbc, gusd } = tokens
  const tokenArr = [wbbc, gusd]
  const fastPriceTokens = [wbbc]

  const priceFeedTimelock = { address: "0x075826d5ea2E18A01f5ec5dAF200cB429906009e" }

  const updater1 = { address: "0x5d2E4189d0b273d7E7C289311978a0183B96C404" }
  const updater2 = { address: "0x60ebaF4eEab2fEE16438fcec1fc1b9a58e57E21d" }
  const keeper1 = { address: "0x5d2E4189d0b273d7E7C289311978a0183B96C404" }
  const keeper2 = { address: "0x60ebaF4eEab2fEE16438fcec1fc1b9a58e57E21d" }
  const updaters = [updater1.address, updater2.address, keeper1.address, keeper2.address]

  const tokenManager = { address: "0x09c688B5F4518B656d957D5Bc55141bbAb337109" }

  const positionRouter = await contractAt("PositionRouter", "0x4c18b32A41a03B01D3520b2Ae3bCf11a01e59BFD")

  const fastPriceEvents = await deployContract("FastPriceEvents", [])
  // const fastPriceEvents = await contractAt("FastPriceEvents", "0x6234e39c84F0AF2B437B32290324e11F23bE3E42")  
  // const fastPriceEvents = await contractAt("FastPriceEvents", "0x02b7023D43bc52bFf8a0C54A9F2ecec053523Bf6", signer)

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter,
    tokenArr,
    updaters,
    priceFeedTimelock
  }
}

async function getPulseValues() {
  const { pls, btc, eth, plsx, hex } = tokens
  const tokenArr = [pls, btc, eth, plsx, hex]
  const fastPriceTokens = [pls, btc, eth, plsx, hex]

  const priceFeedTimelock = { address: "0xEf1D4F68cdBb93E6193F86f4F1dC8699dFE1Afa9" }

  const updater1 = { address: "0xEF5Fa22834316D7A5eBFD55875706B4ec26A9591" }
  const updater2 = { address: "0x7B9F1168fEFAd14403035066cf9c6929a24FB394" }
  const keeper1 = { address: "0xEF5Fa22834316D7A5eBFD55875706B4ec26A9591" }
  const keeper2 = { address: "0x7B9F1168fEFAd14403035066cf9c6929a24FB394" }
  const updaters = [updater1.address, updater2.address, keeper1.address, keeper2.address]

  const tokenManager = { address: "0xb0bCbE2E7D4507066a833CFf9BAFE6b3b6c49937" }

  const positionRouter = await contractAt("PositionRouter", "0x9Be3931A525584017388e334FeC0de35c7cf8aC0")

  // const fastPriceEvents = await deployContract("FastPriceEvents", [])
  const fastPriceEvents = await contractAt("FastPriceEvents", "0x8F879801d3bF2f1A74e19014b9C79a5369964092")  
  // const fastPriceEvents = await contractAt("FastPriceEvents", "0x02b7023D43bc52bFf8a0C54A9F2ecec053523Bf6", signer)

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter,
    tokenArr,
    updaters,
    priceFeedTimelock
  }
}

async function getValues() {
  if (network === "arbitrum") {
    return getArbValues()
  }

  if (network === "avax") {
    return getAvaxValues()
  }

  if (network === "goerli") {
    return getGoerliValues()
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
  // const signer = await getFrameSigner()
  const deployer = { address: "0x7B9F1168fEFAd14403035066cf9c6929a24FB394" }

  const {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter,
    chainlinkFlags,
    tokenArr,
    updaters,
    priceFeedTimelock
  } = await getValues()

  const signers = [
    "0xEF5Fa22834316D7A5eBFD55875706B4ec26A9591", // coinflipcanada
  ]

  if (fastPriceTokens.find(t => !t.fastPricePrecision)) {
    throw new Error("Invalid price precision")
  }

  if (fastPriceTokens.find(t => !t.maxCumulativeDeltaDiff)) {
    throw new Error("Invalid price maxCumulativeDeltaDiff")
  }

  console.log("FastPriceFeed", {
    _priceDuration: 5 * 60, // _priceDuration
    _maxPriceUpdateDelay: 60 * 60, // _maxPriceUpdateDelay
    _minBlockInterval: 0, // _minBlockInterval
    _maxDeviationBasisPoints: 250, // _maxDeviationBasisPoints
    _fastPriceEvents: fastPriceEvents.address, // _fastPriceEvents
    _tokenManager: deployer.address, // _tokenManager
    _positionRouter: positionRouter.address
  })

  const fastPriceFeedArgs = [{
    _priceDuration: 5 * 60, // _priceDuration
    _maxPriceUpdateDelay: 60 * 60, // _maxPriceUpdateDelay
    _minBlockInterval: 0, // _minBlockInterval
    _maxDeviationBasisPoints: 250, // _maxDeviationBasisPoints
    _fastPriceEvents: fastPriceEvents.address, // _fastPriceEvents
    _tokenManager: deployer.address, // _tokenManager
    _positionRouter: positionRouter.address
  }];

  const secondaryPriceFeed = await deployContract("FastPriceFeed", fastPriceFeedArgs)
  // const secondaryPriceFeed = await contractAt("FastPriceFeed", "0xB7EB8b680A4EfB7B41b38813575e0892103A693c")

  const vaultPriceFeed = await contractAt("VaultPriceFeed", "0xe6c897a0993561b8842E8Ef1c75b9A09447A03d8")

  await sendTxn(vaultPriceFeed.setMaxStrictPriceDeviation(expandDecimals(1, 28)), "vaultPriceFeed.setMaxStrictPriceDeviation") // 0.01 USD
  await sendTxn(vaultPriceFeed.setPriceSampleSpace(1), "vaultPriceFeed.setPriceSampleSpace")
  await sendTxn(vaultPriceFeed.setSecondaryPriceFeed(secondaryPriceFeed.address), "vaultPriceFeed.setSecondaryPriceFeed")
  await sendTxn(vaultPriceFeed.setIsAmmEnabled(false), "vaultPriceFeed.setIsAmmEnabled")

  if (chainlinkFlags) {
    await sendTxn(vaultPriceFeed.setChainlinkFlags(chainlinkFlags.address), "vaultPriceFeed.setChainlinkFlags")
  }

  for (const [i, tokenItem] of tokenArr.entries()) {
    if (tokenItem.spreadBasisPoints === undefined) { continue }
    await sendTxn(vaultPriceFeed.setSpreadBasisPoints(
      tokenItem.address, // _token
      tokenItem.spreadBasisPoints // _spreadBasisPoints
    ), `vaultPriceFeed.setSpreadBasisPoints(${tokenItem.name}) ${tokenItem.spreadBasisPoints}`)
  }

  for (const token of tokenArr) {
    await sendTxn(vaultPriceFeed.setTokenConfig(
      token.address, // _token
      token.priceFeed, // _priceFeed
      token.priceDecimals, // _priceDecimals
      token.isStrictStable, // _isStrictStable
      0
    ), `vaultPriceFeed.setTokenConfig(${token.name}) ${token.address} ${token.priceFeed}`)
  }

  await sendTxn(secondaryPriceFeed.initialize(1, signers, updaters), "secondaryPriceFeed.initialize")
  await sendTxn(secondaryPriceFeed.setTokens(fastPriceTokens.map(t => t.address), fastPriceTokens.map(t => t.fastPricePrecision)), "secondaryPriceFeed.setTokens")
  await sendTxn(secondaryPriceFeed.setVaultPriceFeed(vaultPriceFeed.address), "secondaryPriceFeed.setVaultPriceFeed")
  await sendTxn(secondaryPriceFeed.setMaxTimeDeviation(60 * 60), "secondaryPriceFeed.setMaxTimeDeviation")
  await sendTxn(secondaryPriceFeed.setSpreadBasisPointsIfInactive(20), "secondaryPriceFeed.setSpreadBasisPointsIfInactive")
  await sendTxn(secondaryPriceFeed.setSpreadBasisPointsIfChainError(500), "secondaryPriceFeed.setSpreadBasisPointsIfChainError")
  await sendTxn(secondaryPriceFeed.setMaxCumulativeDeltaDiffs(fastPriceTokens.map(t => t.address), fastPriceTokens.map(t => t.maxCumulativeDeltaDiff)), "secondaryPriceFeed.setMaxCumulativeDeltaDiffs")
  await sendTxn(secondaryPriceFeed.setPriceDataInterval(1 * 60), "secondaryPriceFeed.setPriceDataInterval")

  await sendTxn(positionRouter.setPositionKeeper(secondaryPriceFeed.address, true), "positionRouter.setPositionKeeper(secondaryPriceFeed)")
  await sendTxn(fastPriceEvents.setIsPriceFeed(secondaryPriceFeed.address, true), "fastPriceEvents.setIsPriceFeed")

  await sendTxn(vaultPriceFeed.setGov(priceFeedTimelock.address), "vaultPriceFeed.setGov")
  const updater3 = "0x60ebaF4eEab2fEE16438fcec1fc1b9a58e57E21d"
  await sendTxn(secondaryPriceFeed.setUpdater(updater3, true), "secondaryPriceFeed.setUpdater")
  await sendTxn(secondaryPriceFeed.setGov(priceFeedTimelock.address), "secondaryPriceFeed.setGov")
  await sendTxn(secondaryPriceFeed.setTokenManager(tokenManager.address), "secondaryPriceFeed.setTokenManager")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
