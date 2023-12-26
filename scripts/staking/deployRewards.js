const { deployContract, contractAt, sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

async function main() {
  const wallet = { address: "0x5F799f365Fa8A2B60ac0429C48B153cA5a6f0Cf8" }
  const { AddressZero } = ethers.constants

  const weth = { address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" }
  const gplx = await deployContract("GPLX", []);
  const esGplx = await deployContract("EsGPLX", []);
  const bnGplx = await deployContract("MintableBaseToken", ["Bonus GPLX", "bnGPLX", 0]);
  const bnAlp = { address: AddressZero }
  const alp = { address: AddressZero }

  const stakedGplxTracker = await deployContract("RewardTracker", ["Staked GPLX", "sGPLX"])
  const stakedGplxDistributor = await deployContract("RewardDistributor", [esGplx.address, stakedGplxTracker.address])
  await sendTxn(stakedGplxTracker.initialize([gplx.address, esGplx.address], stakedGplxDistributor.address), "stakedGplxTracker.initialize")
  await sendTxn(stakedGplxDistributor.updateLastDistributionTime(), "stakedGplxDistributor.updateLastDistributionTime")

  const bonusGplxTracker = await deployContract("RewardTracker", ["Staked + Bonus GPLX", "sbGPLX"])
  const bonusGplxDistributor = await deployContract("BonusDistributor", [bnGplx.address, bonusGplxTracker.address])
  await sendTxn(bonusGplxTracker.initialize([stakedGplxTracker.address], bonusGplxDistributor.address), "bonusGplxTracker.initialize")
  await sendTxn(bonusGplxDistributor.updateLastDistributionTime(), "bonusGplxDistributor.updateLastDistributionTime")

  const feeGplxTracker = await deployContract("RewardTracker", ["Staked + Bonus + Fee GPLX", "sbfGPLX"])
  const feeGplxDistributor = await deployContract("RewardDistributor", [weth.address, feeGplxTracker.address])
  await sendTxn(feeGplxTracker.initialize([bonusGplxTracker.address, bnGplx.address], feeGplxDistributor.address), "feeGplxTracker.initialize")
  await sendTxn(feeGplxDistributor.updateLastDistributionTime(), "feeGplxDistributor.updateLastDistributionTime")

  const feeGplpTracker = { address: AddressZero }
  const stakedGplpTracker = { address: AddressZero }

  const stakedAlpTracker = { address: AddressZero }
  const bonusAlpTracker = { address: AddressZero }
  const feeAlpTracker = { address: AddressZero }

  const gplpManager = { address: AddressZero }
  const gplp = { address: AddressZero }

  await sendTxn(stakedGplxTracker.setInPrivateTransferMode(true), "stakedGplxTracker.setInPrivateTransferMode")
  await sendTxn(stakedGplxTracker.setInPrivateStakingMode(true), "stakedGplxTracker.setInPrivateStakingMode")
  await sendTxn(bonusGplxTracker.setInPrivateTransferMode(true), "bonusGplxTracker.setInPrivateTransferMode")
  await sendTxn(bonusGplxTracker.setInPrivateStakingMode(true), "bonusGplxTracker.setInPrivateStakingMode")
  await sendTxn(bonusGplxTracker.setInPrivateClaimingMode(true), "bonusGplxTracker.setInPrivateClaimingMode")
  await sendTxn(feeGplxTracker.setInPrivateTransferMode(true), "feeGplxTracker.setInPrivateTransferMode")
  await sendTxn(feeGplxTracker.setInPrivateStakingMode(true), "feeGplxTracker.setInPrivateStakingMode")

  const rewardRouter = await deployContract("RewardRouter", [])

  await sendTxn(rewardRouter.initialize(
    gplx.address,
    esGplx.address,
    bnGplx.address,
    bnAlp.address,
    gplp.address,
    alp.address,
    stakedGplxTracker.address,
    bonusGplxTracker.address,
    feeGplxTracker.address,
    feeGplpTracker.address,
    stakedGplpTracker.address,
    stakedAlpTracker.address,
    bonusAlpTracker.address,
    feeAlpTracker.address,
    gplpManager.address
  ), "rewardRouter.initialize")

  // allow rewardRouter to stake in stakedGplxTracker
  await sendTxn(stakedGplxTracker.setHandler(rewardRouter.address, true), "stakedGplxTracker.setHandler(rewardRouter)")
  // allow bonusGplxTracker to stake stakedGplxTracker
  await sendTxn(stakedGplxTracker.setHandler(bonusGplxTracker.address, true), "stakedGplxTracker.setHandler(bonusGplxTracker)")
  // allow rewardRouter to stake in bonusGplxTracker
  await sendTxn(bonusGplxTracker.setHandler(rewardRouter.address, true), "bonusGplxTracker.setHandler(rewardRouter)")
  // allow bonusGplxTracker to stake feeGplxTracker
  await sendTxn(bonusGplxTracker.setHandler(feeGplxTracker.address, true), "bonusGplxTracker.setHandler(feeGplxTracker)")
  await sendTxn(bonusGplxDistributor.setBonusMultiplier(10000), "bonusGplxDistributor.setBonusMultiplier")
  // allow rewardRouter to stake in feeGplxTracker
  await sendTxn(feeGplxTracker.setHandler(rewardRouter.address, true), "feeGplxTracker.setHandler(rewardRouter)")
  // allow stakedGplxTracker to stake esGplx
  await sendTxn(esGplx.setHandler(stakedGplxTracker.address, true), "esGplx.setHandler(stakedGplxTracker)")
  // allow feeGplxTracker to stake bnGplx
  await sendTxn(bnGplx.setHandler(feeGplxTracker.address, true), "bnGplx.setHandler(feeGplxTracker")
  // allow rewardRouter to burn bnGplx
  await sendTxn(bnGplx.setMinter(rewardRouter.address, true), "bnGplx.setMinter(rewardRouter")

  // mint esGplx for distributors
  await sendTxn(esGplx.setMinter(wallet.address, true), "esGplx.setMinter(wallet)")
  await sendTxn(esGplx.mint(stakedGplxDistributor.address, expandDecimals(50000 * 12, 18)), "esGplx.mint(stakedGplxDistributor") // ~50,000 GPLX per month
  await sendTxn(stakedGplxDistributor.setTokensPerInterval("20667989410000000"), "stakedGplxDistributor.setTokensPerInterval") // 0.02066798941 esGplx per second

  // mint bnGplx for distributor
  await sendTxn(bnGplx.setMinter(wallet.address, true), "bnGplx.setMinter")
  await sendTxn(bnGplx.mint(bonusGplxDistributor.address, expandDecimals(15 * 1000 * 1000, 18)), "bnGplx.mint(bonusGplxDistributor)")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
