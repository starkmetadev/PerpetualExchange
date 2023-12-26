const { deployContract, contractAt, writeTmpAddresses, sendTxn } = require("../shared/helpers")

async function main() {
  const tokenManager = await deployContract("TokenManager", [1], "TokenManager")

  const signers = [
    "0xEF5Fa22834316D7A5eBFD55875706B4ec26A9591",
    // "0x59790E88301b2376d5c3C421D6B4b6D640D18E8d",
    // "0x5d2E4189d0b273d7E7C289311978a0183B96C404",
    // "0x59790E88301b2376d5c3C421D6B4b6D640D18E8d"
  ]

  await sendTxn(tokenManager.initialize(signers), "tokenManager.initialize")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
