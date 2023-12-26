const { deployContract, contractAt, sendTxn, callWithRetries } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toChainlinkPrice } = require("../../test/shared/chainlink")

const network = (process.env.HARDHAT_NETWORK || 'pulse');
const tokens = require('./tokens')[network];

async function main() {
  const vault = await contractAt("Vault", "0xC2311efFE60b0dC2491148Ff1bd46F08D64ADC98")
  const vaultPriceFeed = await contractAt("VaultPriceFeed", "0xe6c897a0993561b8842E8Ef1c75b9A09447A03d8")
  console.log("vault", vault.address)
  console.log("vaultPriceFeed", vaultPriceFeed.address)

  const { pls, btc, eth, plsx, inc, hex, usdt, usdc, dai } = tokens
  const tokenArr = [pls, btc, eth, plsx, hex, usdt, usdc, dai]
  // const tokenArr = [hex]

  for (const token of tokenArr) {
    await sendTxn(vaultPriceFeed.setTokenConfig(
      token.address, // _token
      token.priceFeed, // _priceFeed
      token.priceDecimals, // _priceDecimals
      token.isStrictStable, // _isStrictStable
      0
    ), `vaultPriceFeed.setTokenConfig(${token.name}) ${token.address} ${token.priceFeed}`)

    await sendTxn(vault.setTokenConfig(
      token.address, // _token
      token.decimals, // _tokenDecimals
      token.tokenWeight, // _tokenWeight
      token.minProfitBps, // _minProfitBps
      expandDecimals(token.maxUsdgAmount, 18), // _maxUsdgAmount
      token.isStable, // _isStable
      token.isShortable // _isShortable
    ), `vault.setTokenConfig(${token.name}) ${token.address}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
