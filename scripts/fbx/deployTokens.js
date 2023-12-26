const { deployContract, contractAt, writeTmpAddresses } = require("../shared/helpers")

async function main() {
  await deployContract("EsGPLX", [])
  // await deployContract("GPLP", [])
  // await deployContract("MintableBaseToken", ["esGPLX IOU", "esGPLX:IOU", 0])
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
