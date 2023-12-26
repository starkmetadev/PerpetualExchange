const { deployContract, contractAt , sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")
const { errors } = require("../../test/core/Vault/helpers")

const network = (process.env.HARDHAT_NETWORK || 'pulse');
const tokens = require('./tokens')[network];

async function main() {
  const vault = await contractAt("Vault", "0x215EB00765c3AFB552a421b5824585E944f01278")
  const orderBook = await contractAt("OrderBook", "0xddb537c075758F9E2c719EBF4CAE7494D1d4D7C0")
  await deployContract("OrderExecutor", [vault.address, orderBook.address])
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
