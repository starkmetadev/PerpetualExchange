const { deployContract, contractAt, sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

async function main() {
  const rewardRouter = await contractAt("RewardRouter", "0xEa7fCb85802713Cb03291311C66d6012b23402ea")
  const bnGplx = await contractAt("MintableBaseToken", "0x35247165119B69A40edD5304969560D0ef486921")
  const gplpManager = await contractAt("GplpManager", "0x91425Ac4431d068980d497924DD540Ae274f3270")

  const stakedGplxTracker = await contractAt("RewardTracker", "0x908C4D94D34924765f1eDc22A1DD098397c59dD4")
  const bonusGplxTracker = await contractAt("RewardTracker", "0x4d268a7d4C16ceB5a606c173Bd974984343fea13")
  const feeGplxTracker = await contractAt("RewardTracker", "0xd2D1162512F927a7e282Ef43a362659E4F2a728F")

  const feeGplpTracker = await contractAt("RewardTracker", "0x4e971a87900b931fF39d1Aad67697F49835400b6")
  const stakedGplpTracker = await contractAt("RewardTracker", "0x1aDDD80E6039594eE970E5872D247bf0414C8903")

  // allow rewardRouter to stake in stakedGplxTracker
  await sendTxn(stakedGplxTracker.setHandler(rewardRouter.address, false), "stakedGplxTracker.setHandler(rewardRouter)")
  // allow rewardRouter to stake in bonusGplxTracker
  await sendTxn(bonusGplxTracker.setHandler(rewardRouter.address, false), "bonusGplxTracker.setHandler(rewardRouter)")
  // allow rewardRouter to stake in feeGplxTracker
  await sendTxn(feeGplxTracker.setHandler(rewardRouter.address, false), "feeGplxTracker.setHandler(rewardRouter)")
  // allow rewardRouter to burn bnGplx
  await sendTxn(bnGplx.setMinter(rewardRouter.address, false), "bnGplx.setMinter(rewardRouter)")

  // allow rewardRouter to mint in gplpManager
  await sendTxn(gplpManager.setHandler(rewardRouter.address, false), "gplpManager.setHandler(rewardRouter)")
  // allow rewardRouter to stake in feeGplpTracker
  await sendTxn(feeGplpTracker.setHandler(rewardRouter.address, false), "feeGplpTracker.setHandler(rewardRouter)")
  // allow rewardRouter to stake in stakedGplpTracker
  await sendTxn(stakedGplpTracker.setHandler(rewardRouter.address, false), "stakedGplpTracker.setHandler(rewardRouter)")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
