const { deployContract, contractAt, writeTmpAddresses } = require("../shared/helpers")

async function main() {
  await deployContract("MintableBaseToken", ["VestingOption", "ARB:GPLX", 0])
  await deployContract("MintableBaseToken", ["VestingOption", "ARB:GPLP", 0])
  await deployContract("MintableBaseToken", ["VestingOption", "AVAX:GPLX", 0])
  await deployContract("MintableBaseToken", ["VestingOption", "AVAX:GPLP", 0])
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
