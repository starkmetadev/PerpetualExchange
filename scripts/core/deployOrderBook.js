const { deployContract, contractAt , sendTxn, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'pulse');
const tokens = require('./tokens')[network];

async function main() {
  const { nativeToken } = tokens

  const orderBook = await deployContract("OrderBook", []);
  // const orderBook = await contractAt("OrderBook", "0xb3E8745f0A0FCa7dCBF74fd05F8bf0363008D686");

  // Arbitrum mainnet addresses
  await sendTxn(orderBook.initialize(
    "0xE127951535C13E2037ED1F1203Ef265150Bed1f0", // router
    "0xC2311efFE60b0dC2491148Ff1bd46F08D64ADC98", // vault
    nativeToken.address, // weth
    "0xC3dF11AC1838dbE7B8762FBAFE23DfA354a7F23d", // usdg
    "1000000000000000000000", // 0.01 AVAX
    expandDecimals(10, 30) // min purchase token amount usd
  ), "orderBook.initialize");

  writeTmpAddresses({
    orderBook: orderBook.address
  })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
