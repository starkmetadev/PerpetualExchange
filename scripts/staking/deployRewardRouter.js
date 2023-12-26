const { deployContract, contractAt, sendTxn, readTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'pulse');
const tokens = require('../core/tokens')[network];

async function main() {
  const {
    nativeToken
  } = tokens

  const weth = await contractAt("Token", nativeToken.address)
  const gplx = await contractAt("GPLX", "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a")
  const esGplx = await contractAt("EsGPLX", "0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA")
  const bnGplx = await contractAt("MintableBaseToken", "0x35247165119B69A40edD5304969560D0ef486921")

  const stakedGplxTracker = await contractAt("RewardTracker", "0x908C4D94D34924765f1eDc22A1DD098397c59dD4")
  const bonusGplxTracker = await contractAt("RewardTracker", "0x4d268a7d4C16ceB5a606c173Bd974984343fea13")
  const feeGplxTracker = await contractAt("RewardTracker", "0xd2D1162512F927a7e282Ef43a362659E4F2a728F")

  const feeGplpTracker = await contractAt("RewardTracker", "0x4e971a87900b931fF39d1Aad67697F49835400b6")
  const stakedGplpTracker = await contractAt("RewardTracker", "0x1aDDD80E6039594eE970E5872D247bf0414C8903")

  const gplp = await contractAt("GPLP", "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258")
  const gplpManager = await contractAt("GplpManager", "0x321F653eED006AD1C29D174e17d96351BDe22649")

  console.log("gplpManager", gplpManager.address)

  const rewardRouter = await deployContract("RewardRouter", [])

  await sendTxn(rewardRouter.initialize(
    weth.address,
    gplx.address,
    esGplx.address,
    bnGplx.address,
    gplp.address,
    stakedGplxTracker.address,
    bonusGplxTracker.address,
    feeGplxTracker.address,
    feeGplpTracker.address,
    stakedGplpTracker.address,
    gplpManager.address
  ), "rewardRouter.initialize")

  // allow rewardRouter to stake in stakedGplxTracker
  await sendTxn(stakedGplxTracker.setHandler(rewardRouter.address, true), "stakedGplxTracker.setHandler(rewardRouter)")
  // allow rewardRouter to stake in bonusGplxTracker
  await sendTxn(bonusGplxTracker.setHandler(rewardRouter.address, true), "bonusGplxTracker.setHandler(rewardRouter)")
  // allow rewardRouter to stake in feeGplxTracker
  await sendTxn(feeGplxTracker.setHandler(rewardRouter.address, true), "feeGplxTracker.setHandler(rewardRouter)")
  // allow rewardRouter to burn bnGplx
  await sendTxn(bnGplx.setMinter(rewardRouter.address, true), "bnGplx.setMinter(rewardRouter)")

  // allow rewardRouter to mint in gplpManager
  await sendTxn(gplpManager.setHandler(rewardRouter.address, true), "gplpManager.setHandler(rewardRouter)")
  // allow rewardRouter to stake in feeGplpTracker
  await sendTxn(feeGplpTracker.setHandler(rewardRouter.address, true), "feeGplpTracker.setHandler(rewardRouter)")
  // allow rewardRouter to stake in stakedGplpTracker
  await sendTxn(stakedGplpTracker.setHandler(rewardRouter.address, true), "stakedGplpTracker.setHandler(rewardRouter)")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
