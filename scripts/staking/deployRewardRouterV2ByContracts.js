const { deployContract, contractAt, sendTxn, writeTmpAddresses } = require("../shared/helpers")

const network = (process.env.HARDHAT_NETWORK || 'pulse');
const tokens = require('../core/tokens')[network];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const { nativeToken } = tokens

  const vestingDuration = 365 * 24 * 60 * 60

  const gplpManager = await contractAt("GplpManager", "0x3a417b2949d59B129e5C6c0A52114335C780B9AE")
  const gplp = await contractAt("GPLP", "0xA63FbC76dDaf2F800B3699a4a46C5f260E04050C")

  const gplx = await contractAt("GPLX", "0x39E1Da9a034Fd5ADba01C7F6cFA8B5dE16dD908c");
  const esGplx = await contractAt("EsGPLX", "0x6CdEf99C74CcF3FA65211fF547Be5dDB4A73770C");
  // const bnGplx = await deployContract("MintableBaseToken", ["Bonus GPLX", "bnGPLX", 0]);
  const bnGplx = await contractAt("MintableBaseToken", "0x6e29e6db1Ea778fCC17BA575C8fB22A4dfeAE08f");


  // await sendTxn(esGplx.setInPrivateTransferMode(true), "esGplx.setInPrivateTransferMode")
  // await sendTxn(gplp.setInPrivateTransferMode(true), "gplp.setInPrivateTransferMode")

  // const stakedGplxTracker = await deployContract("RewardTracker", ["Staked GPLX", "sGPLX"])
  const stakedGplxTracker = await contractAt("RewardTracker", "0x48d7f4529f6149c5EB96AeF38534b90AD7562b4d")
  // const stakedGplxDistributor = await deployContract("RewardDistributor", [esGplx.address, stakedGplxTracker.address])
  const stakedGplxDistributor = await contractAt("RewardDistributor", "0x4e11F35A9c226be709078787cC44375FD7c22424")

  // await sendTxn(stakedGplxTracker.initialize([gplx.address, esGplx.address], stakedGplxDistributor.address), "stakedGplxTracker.initialize")
  // await sendTxn(stakedGplxDistributor.updateLastDistributionTime(), "stakedGplxDistributor.updateLastDistributionTime")

  // const bonusGplxTracker = await deployContract("RewardTracker", ["Staked + Bonus GPLX", "sbGPLX"])
  const bonusGplxTracker = await contractAt("RewardTracker", "0xC5fcC14560781C4c9FD55d7466d781539177A3a4")

  // const bonusGplxDistributor = await deployContract("BonusDistributor", [bnGplx.address, bonusGplxTracker.address])
  const bonusGplxDistributor = await contractAt("BonusDistributor", "0x667Af1B5Cb7b86107B0B9BEa3AE3C44506E1d8Ce")

  // await sendTxn(bonusGplxTracker.initialize([stakedGplxTracker.address], bonusGplxDistributor.address), "bonusGplxTracker.initialize")
  // await sendTxn(bonusGplxDistributor.updateLastDistributionTime(), "bonusGplxDistributor.updateLastDistributionTime")

  // const feeGplxTracker = await deployContract("RewardTracker", ["Staked + Bonus + Fee GPLX", "sbfGPLX"])
  const feeGplxTracker = await contractAt("RewardTracker", "0xb31018C29500a565e511a0800dA87e1457CdE9b1")

  // const feeGplxDistributor = await deployContract("RewardDistributor", [nativeToken.address, feeGplxTracker.address])
  const feeGplxDistributor = await contractAt("RewardDistributor", "0xd04EA0a03850786b7d057Ac668A3ab9B3E00199D")

  // await sendTxn(feeGplxTracker.initialize([bonusGplxTracker.address, bnGplx.address], feeGplxDistributor.address), "feeGplxTracker.initialize")
  // await sendTxn(feeGplxDistributor.updateLastDistributionTime(), "feeGplxDistributor.updateLastDistributionTime")

  // const feeGplpTracker = await deployContract("RewardTracker", ["Fee GPLP", "fGPLP"])
  const feeGplpTracker = await contractAt("RewardTracker", "0x82b84dc1A46D43747496E62BBEE2c70Ef8EE4EAD")

  // const feeGplpDistributor = await deployContract("RewardDistributor", [nativeToken.address, feeGplpTracker.address])
  const feeGplpDistributor = await contractAt("RewardDistributor", "0x6445024BFA34a160714d0099D7F24f0b19Bb3C0c")

  // await sendTxn(feeGplpTracker.initialize([gplp.address], feeGplpDistributor.address), "feeGplpTracker.initialize")
  // await sendTxn(feeGplpDistributor.updateLastDistributionTime(), "feeGplpDistributor.updateLastDistributionTime")

  // const stakedGplpTracker = await deployContract("RewardTracker", ["Fee + Staked GPLP", "fsGPLP"])
  const stakedGplpTracker = await contractAt("RewardTracker", "0x8b498C45465f4a7e9CEc0D12Aa6a695A6b563A34")

  // const stakedGplpDistributor = await deployContract("RewardDistributor", [esGplx.address, stakedGplpTracker.address])
  const stakedGplpDistributor = await contractAt("RewardDistributor", "0x7ed80C511359db0E34e2FbF14aB12Ee9AfAB0Baa")
  // await sendTxn(stakedGplpTracker.initialize([feeGplpTracker.address], stakedGplpDistributor.address), "stakedGplpTracker.initialize")
  // await sendTxn(stakedGplpDistributor.updateLastDistributionTime(), "stakedGplpDistributor.updateLastDistributionTime")

  // await sendTxn(stakedGplxTracker.setInPrivateTransferMode(true), "stakedGplxTracker.setInPrivateTransferMode")
  // await sendTxn(stakedGplxTracker.setInPrivateStakingMode(true), "stakedGplxTracker.setInPrivateStakingMode")
  // await sendTxn(bonusGplxTracker.setInPrivateTransferMode(true), "bonusGplxTracker.setInPrivateTransferMode")
  // await sendTxn(bonusGplxTracker.setInPrivateStakingMode(true), "bonusGplxTracker.setInPrivateStakingMode")
  // await sendTxn(bonusGplxTracker.setInPrivateClaimingMode(true), "bonusGplxTracker.setInPrivateClaimingMode")
  // await sendTxn(feeGplxTracker.setInPrivateTransferMode(true), "feeGplxTracker.setInPrivateTransferMode")
  // await sendTxn(feeGplxTracker.setInPrivateStakingMode(true), "feeGplxTracker.setInPrivateStakingMode")

  // await sendTxn(feeGplpTracker.setInPrivateTransferMode(true), "feeGplpTracker.setInPrivateTransferMode")
  // await sendTxn(feeGplpTracker.setInPrivateStakingMode(true), "feeGplpTracker.setInPrivateStakingMode")
  // await sendTxn(stakedGplpTracker.setInPrivateTransferMode(true), "stakedGplpTracker.setInPrivateTransferMode")
  // await sendTxn(stakedGplpTracker.setInPrivateStakingMode(true), "stakedGplpTracker.setInPrivateStakingMode")

  // const gplxVester = await deployContract("Vester", [
  //   "Vested GPLX", // _name
  //   "vGPLX", // _symbol
  //   vestingDuration, // _vestingDuration
  //   esGplx.address, // _esToken
  //   feeGplxTracker.address, // _pairToken
  //   gplx.address, // _claimableToken
  //   stakedGplxTracker.address, // _rewardTracker
  // ])
  const gplxVester = await contractAt("Vester", "0x957C9a17fc5A5Fda190D1Bc4Fc1AF2B6282C2743")
  //
  // const gplpVester = await deployContract("Vester", [
  //   "Vested GPLP", // _name
  //   "vGPLP", // _symbol
  //   vestingDuration, // _vestingDuration
  //   esGplx.address, // _esToken
  //   stakedGplpTracker.address, // _pairToken
  //   gplx.address, // _claimableToken
  //   stakedGplpTracker.address, // _rewardTracker
  // ])
  const gplpVester = await contractAt("Vester", "0xcf920DC4df556267A82783c4647cbe9Ce55cB1A2")
  // const rewardRouter = await deployContract("RewardRouterV2", [])
  const rewardRouter = await contractAt("RewardRouterV2", "0x0AB63435EbA15CCedb44d86Cf3e2f1d8DBeB9e08")

  // await sendTxn(rewardRouter.initialize(
  //   nativeToken.address,
  //   gplx.address,
  //   esGplx.address,
  //   bnGplx.address,
  //   gplp.address,
  //   stakedGplxTracker.address,
  //   bonusGplxTracker.address,
  //   feeGplxTracker.address,
  //   feeGplpTracker.address,
  //   stakedGplpTracker.address,
  //   gplpManager.address,
  //   gplxVester.address,
  //   gplpVester.address
  // ), "rewardRouter.initialize")

  await sendTxn(gplpManager.setHandler(rewardRouter.address, true), "gplpManager.setHandler(rewardRouter)")
  await sleep(15000)
  // allow rewardRouter to stake in stakedGplxTracker
  await sendTxn(stakedGplxTracker.setHandler(rewardRouter.address, true), "stakedGplxTracker.setHandler(rewardRouter)")
  await sleep(15000)
  // allow bonusGplxTracker to stake stakedGplxTracker
  await sendTxn(stakedGplxTracker.setHandler(bonusGplxTracker.address, true), "stakedGplxTracker.setHandler(bonusGplxTracker)")
  await sleep(15000)
  // allow rewardRouter to stake in bonusGplxTracker
  await sendTxn(bonusGplxTracker.setHandler(rewardRouter.address, true), "bonusGplxTracker.setHandler(rewardRouter)")
  await sleep(15000)
  // allow bonusGplxTracker to stake feeGplxTracker
  await sendTxn(bonusGplxTracker.setHandler(feeGplxTracker.address, true), "bonusGplxTracker.setHandler(feeGplxTracker)")
  await sleep(15000)
  await sendTxn(bonusGplxDistributor.setBonusMultiplier(10000), "bonusGplxDistributor.setBonusMultiplier")
  await sleep(15000)
  // allow rewardRouter to stake in feeGplxTracker
  await sendTxn(feeGplxTracker.setHandler(rewardRouter.address, true), "feeGplxTracker.setHandler(rewardRouter)")
  await sleep(15000)
  // allow stakedGplxTracker to stake esGplx
  await sendTxn(esGplx.setHandler(stakedGplxTracker.address, true), "esGplx.setHandler(stakedGplxTracker)")
  await sleep(15000)
  // allow feeGplxTracker to stake bnGplx
  await sendTxn(bnGplx.setHandler(feeGplxTracker.address, true), "bnGplx.setHandler(feeGplxTracker")
  await sleep(15000)
  // allow rewardRouter to burn bnGplx
  await sendTxn(bnGplx.setMinter(rewardRouter.address, true), "bnGplx.setMinter(rewardRouter")
  await sleep(15000)

  // allow stakedGplpTracker to stake feeGplpTracker
  await sendTxn(feeGplpTracker.setHandler(stakedGplpTracker.address, true), "feeGplpTracker.setHandler(stakedGplpTracker)")
  await sleep(15000)
  // allow feeGplpTracker to stake gplp
  await sendTxn(gplp.setHandler(feeGplpTracker.address, true), "gplp.setHandler(feeGplpTracker)")
  await sleep(15000)

  // allow rewardRouter to stake in feeGplpTracker
  await sendTxn(feeGplpTracker.setHandler(rewardRouter.address, true), "feeGplpTracker.setHandler(rewardRouter)")
  await sleep(15000)
  // allow rewardRouter to stake in stakedGplpTracker
  await sendTxn(stakedGplpTracker.setHandler(rewardRouter.address, true), "stakedGplpTracker.setHandler(rewardRouter)")
  await sleep(15000)

  await sendTxn(esGplx.setHandler(rewardRouter.address, true), "esGplx.setHandler(rewardRouter)")
  await sleep(15000)
  await sendTxn(esGplx.setHandler(stakedGplxDistributor.address, true), "esGplx.setHandler(stakedGplxDistributor)")
  await sleep(15000)
  await sendTxn(esGplx.setHandler(stakedGplpDistributor.address, true), "esGplx.setHandler(stakedGplpDistributor)")
  await sleep(15000)
  await sendTxn(esGplx.setHandler(stakedGplpTracker.address, true), "esGplx.setHandler(stakedGplpTracker)")
  await sleep(15000)
  await sendTxn(esGplx.setHandler(gplxVester.address, true), "esGplx.setHandler(gplxVester)")
  await sleep(15000)
  await sendTxn(esGplx.setHandler(gplpVester.address, true), "esGplx.setHandler(gplpVester)")
  await sleep(15000)

  await sendTxn(esGplx.setMinter(gplxVester.address, true), "esGplx.setMinter(gplxVester)")
  await sleep(15000)
  await sendTxn(esGplx.setMinter(gplpVester.address, true), "esGplx.setMinter(gplpVester)")
  await sleep(15000)

  await sendTxn(gplxVester.setHandler(rewardRouter.address, true), "gplxVester.setHandler(rewardRouter)")
  await sleep(15000)
  await sendTxn(gplpVester.setHandler(rewardRouter.address, true), "gplpVester.setHandler(rewardRouter)")
  await sleep(15000)

  await sendTxn(feeGplxTracker.setHandler(gplxVester.address, true), "feeGplxTracker.setHandler(gplxVester)")
  await sleep(15000)
  await sendTxn(stakedGplpTracker.setHandler(gplpVester.address, true), "stakedGplpTracker.setHandler(gplpVester)")
  await sleep(15000)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
