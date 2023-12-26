const { deployContract, contractAt , sendTxn, writeTmpAddresses, callWithRetries } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")

const network = (process.env.HARDHAT_NETWORK || 'pulse');
const tokens = require('./tokens')[network];

async function main() {
  const {
    nativeToken
  } = tokens

  const vault = await contractAt("Vault", "0xDE3590067c811b6F023b557ed45E4f1067859663")
  const usdg = await contractAt("USDG", "0x45096e7aA921f27590f8F19e457794EB09678141")
  const gplp = await contractAt("GPLP", "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258")

  const gplpManager = await deployContract("GplpManager", [vault.address, usdg.address, gplp.address, 15 * 60])

  await sendTxn(gplpManager.setInPrivateMode(true), "gplpManager.setInPrivateMode")

  await sendTxn(gplp.setMinter(gplpManager.address, true), "gplp.setMinter")
  await sendTxn(usdg.addVault(gplpManager.address), "usdg.addVault")
  await sendTxn(vault.setManager(gplpManager.address, true), "vault.setManager")

  writeTmpAddresses({
    gplpManager: gplpManager.address
  })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
