const { deployContract, contractAt, sendTxn, writeTmpAddresses } = require("../shared/helpers")

const network = (process.env.HARDHAT_NETWORK || 'pulse');
const tokens = require('../core/tokens')[network];

async function main() {
  const { nativeToken } = tokens

  const vestingDuration = 365 * 24 * 60 * 60

  const gplpManager = await contractAt("GplpManager", "0xcBD1522BB2745963456338a9477a018680608C17")
  const gplp = await contractAt("GPLP", "0x0a7Ea3F42d9218C23EF63De4D45D7FD119dB9e8e")

  const gplx = await contractAt("GPLX", "0xccb0d8790bbb82754d6d2f79e61ceEE8582704c6");
  const esGplx = await contractAt("EsGPLX", "0x1F253790ce3767c53fd791F28518E80976a288FA");
  const bnGplx = await deployContract("MintableBaseToken", ["Bonus GPLX", "bnGPLX", 0]);
  // const bnGplx = await contractAt("MintableBaseToken", "0xd5A94b0b12dB0578163728d4118A6029c747639a");

  await sendTxn(esGplx.setInPrivateTransferMode(true), "esGplx.setInPrivateTransferMode")
  await sendTxn(gplp.setInPrivateTransferMode(true), "gplp.setInPrivateTransferMode")

  const stakedGplxTracker = await deployContract("RewardTracker", ["Staked GPLX", "sGPLX"])
  const stakedGplxDistributor = await deployContract("RewardDistributor", [esGplx.address, stakedGplxTracker.address])
  // const stakedGplxTracker = await contractAt("RewardTracker", "0x8E111f88e50999938ceeF5ef75a79630e8D2E79b");
  // const stakedGplxDistributor = await contractAt("RewardDistributor", "0x35e993cbE8Ca4cb26601392Bbf173e87aD22EC25");
  await sendTxn(stakedGplxTracker.initialize([gplx.address, esGplx.address], stakedGplxDistributor.address), "stakedGplxTracker.initialize")
  await sendTxn(stakedGplxDistributor.updateLastDistributionTime(), "stakedGplxDistributor.updateLastDistributionTime")

  const bonusGplxTracker = await deployContract("RewardTracker", ["Staked + Bonus GPLX", "sbGPLX"])
  const bonusGplxDistributor = await deployContract("BonusDistributor", [bnGplx.address, bonusGplxTracker.address])
  // const bonusGplxTracker = await contractAt("RewardTracker", "0xA675bBc2367378D8c718f29Ef65EcC765372223B");
  // const bonusGplxDistributor = await contractAt("BonusDistributor", "0x27008BbE4E092ae3B1018aF3EFfC7be0b9A3a48F");
  await sendTxn(bonusGplxTracker.initialize([stakedGplxTracker.address], bonusGplxDistributor.address), "bonusGplxTracker.initialize")
  await sendTxn(bonusGplxDistributor.updateLastDistributionTime(), "bonusGplxDistributor.updateLastDistributionTime")

  const feeGplxTracker = await deployContract("RewardTracker", ["Staked + Bonus + Fee GPLX", "sbfGPLX"])
  const feeGplxDistributor = await deployContract("RewardDistributor", [nativeToken.address, feeGplxTracker.address])
  // const feeGplxTracker = await contractAt("RewardTracker", "0x10Aa150ddeC3d54870c943299d9b530b9815CBCb");
  // const feeGplxDistributor = await contractAt("RewardDistributor", "0x22f102734cb900210EC66628E8b3C3c328fA0315");
  await sendTxn(feeGplxTracker.initialize([bonusGplxTracker.address, bnGplx.address], feeGplxDistributor.address), "feeGplxTracker.initialize")
  await sendTxn(feeGplxDistributor.updateLastDistributionTime(), "feeGplxDistributor.updateLastDistributionTime")

  const feeGplpTracker = await deployContract("RewardTracker", ["Fee GPLP", "fGPLP"])
  const feeGplpDistributor = await deployContract("RewardDistributor", [nativeToken.address, feeGplpTracker.address])
  // const feeGplpTracker = await contractAt("RewardTracker", "0x5b1013DE235505DAA5C45B68eE1D151655bCeF1e");
  // const feeGplpDistributor = await contractAt("RewardDistributor", "0x4057f672aeEa2F71a0738F3a2de1Ad0F7498A685");
  await sendTxn(feeGplpTracker.initialize([gplp.address], feeGplpDistributor.address), "feeGplpTracker.initialize")
  await sendTxn(feeGplpDistributor.updateLastDistributionTime(), "feeGplpDistributor.updateLastDistributionTime")

  const stakedGplpTracker = await deployContract("RewardTracker", ["Fee + Staked GPLP", "fsGPLP"])
  const stakedGplpDistributor = await deployContract("RewardDistributor", [esGplx.address, stakedGplpTracker.address])
  // const stakedGplpTracker = await contractAt("RewardTracker", "0x9BAac9d7fc00D3A3aEAD18213E177Cf07e1B70e3");
  // const stakedGplpDistributor = await contractAt("RewardDistributor", "0x91fbBa651d128cD76153cdC97ecfAc0618f127FD");
  await sendTxn(stakedGplpTracker.initialize([feeGplpTracker.address], stakedGplpDistributor.address), "stakedGplpTracker.initialize")
  await sendTxn(stakedGplpDistributor.updateLastDistributionTime(), "stakedGplpDistributor.updateLastDistributionTime")

  await sendTxn(stakedGplxTracker.setInPrivateTransferMode(true), "stakedGplxTracker.setInPrivateTransferMode")
  await sendTxn(stakedGplxTracker.setInPrivateStakingMode(true), "stakedGplxTracker.setInPrivateStakingMode")
  await sendTxn(bonusGplxTracker.setInPrivateTransferMode(true), "bonusGplxTracker.setInPrivateTransferMode")
  await sendTxn(bonusGplxTracker.setInPrivateStakingMode(true), "bonusGplxTracker.setInPrivateStakingMode")
  await sendTxn(bonusGplxTracker.setInPrivateClaimingMode(true), "bonusGplxTracker.setInPrivateClaimingMode")
  await sendTxn(feeGplxTracker.setInPrivateTransferMode(true), "feeGplxTracker.setInPrivateTransferMode")
  await sendTxn(feeGplxTracker.setInPrivateStakingMode(true), "feeGplxTracker.setInPrivateStakingMode")

  await sendTxn(feeGplpTracker.setInPrivateTransferMode(true), "feeGplpTracker.setInPrivateTransferMode")
  await sendTxn(feeGplpTracker.setInPrivateStakingMode(true), "feeGplpTracker.setInPrivateStakingMode")
  await sendTxn(stakedGplpTracker.setInPrivateTransferMode(true), "stakedGplpTracker.setInPrivateTransferMode")
  await sendTxn(stakedGplpTracker.setInPrivateStakingMode(true), "stakedGplpTracker.setInPrivateStakingMode")

  console.log("gplxVester = ", {
    _name: "Vested GPLX", // _name
    _symbol: "vGPLX", // _symbol
    _vestingDuration: vestingDuration, // _vestingDuration
    _esToken: esGplx.address, // _esToken
    _pairToken: feeGplxTracker.address, // _pairToken
    _claimableToken: gplx.address, // _claimableToken
    _rewardTracker: stakedGplxTracker.address, // _rewardTracker
  })

  const gplxVester = await deployContract("Vester", [{
    _name: "Vested GPLX", // _name
    _symbol: "vGPLX", // _symbol
    _vestingDuration: vestingDuration, // _vestingDuration
    _esToken: esGplx.address, // _esToken
    _pairToken: feeGplxTracker.address, // _pairToken
    _claimableToken: gplx.address, // _claimableToken
    _rewardTracker: stakedGplxTracker.address, // _rewardTracker
  }
  ])
  // const gplxVester = await contractAt("Vester", "0x5BbEa30Fe236d59E4c732F2d63c02ecB58f2088c");

  console.log("gplpVester = ", {
    _name: "Vested GPLP", // _name
    _symbol: "vGPLP", // _symbol
     _vestingDuration: vestingDuration, // _vestingDuration
     _esToken: esGplx.address, // _esToken
     _pairToken: stakedGplpTracker.address, // _pairToken
     _claimableToken: gplx.address, // _claimableToken
     _rewardTracker: stakedGplpTracker.address, // _rewardTracker
  })

  const gplpVester = await deployContract("Vester", [{
    _name: "Vested GPLP", // _name
    _symbol: "vGPLP", // _symbol
     _vestingDuration: vestingDuration, // _vestingDuration
     _esToken: esGplx.address, // _esToken
     _pairToken: stakedGplpTracker.address, // _pairToken
     _claimableToken: gplx.address, // _claimableToken
     _rewardTracker: stakedGplpTracker.address, // _rewardTracker
  }
  ])

  // const gplpVester = await contractAt("Vester", "0x33f4cf97edBDCf1BBE9712ABA8E14788129E28D3");

  const rewardRouter = await deployContract("RewardRouterV2", [])
  // const rewardRouter = await contractAt("RewardRouterV2", "0xbB31eaD0682DD4C75587C0d72F3a69042aa34614");

  await sendTxn(rewardRouter.initialize({
    _weth: nativeToken.address,
    _gplx: gplx.address,
    _esGplx: esGplx.address,
    _bnGplx: bnGplx.address,
    _gplp: gplp.address,
    _stakedGplxTracker: stakedGplxTracker.address,
    _bonusGplxTracker: bonusGplxTracker.address,
    _feeGplxTracker: feeGplxTracker.address,
    _feeGplpTracker: feeGplpTracker.address,
    _stakedGplpTracker: stakedGplpTracker.address,
    _gplpManager: gplpManager.address,
    _gplxVester: gplxVester.address,
    _gplpVester: gplpVester.address
  }
  ), "rewardRouter.initialize")

  await sendTxn(gplpManager.setHandler(rewardRouter.address, true), "gplpManager.setHandler(rewardRouter)")

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

  // allow stakedGplpTracker to stake feeGplpTracker
  await sendTxn(feeGplpTracker.setHandler(stakedGplpTracker.address, true), "feeGplpTracker.setHandler(stakedGplpTracker)")
  // allow feeGplpTracker to stake gplp
  await sendTxn(gplp.setHandler(feeGplpTracker.address, true), "gplp.setHandler(feeGplpTracker)")

  // allow rewardRouter to stake in feeGplpTracker
  await sendTxn(feeGplpTracker.setHandler(rewardRouter.address, true), "feeGplpTracker.setHandler(rewardRouter)")
  // allow rewardRouter to stake in stakedGplpTracker
  await sendTxn(stakedGplpTracker.setHandler(rewardRouter.address, true), "stakedGplpTracker.setHandler(rewardRouter)")

  await sendTxn(esGplx.setHandler(rewardRouter.address, true), "esGplx.setHandler(rewardRouter)")
  await sendTxn(esGplx.setHandler(stakedGplxDistributor.address, true), "esGplx.setHandler(stakedGplxDistributor)")
  await sendTxn(esGplx.setHandler(stakedGplpDistributor.address, true), "esGplx.setHandler(stakedGplpDistributor)")
  await sendTxn(esGplx.setHandler(stakedGplpTracker.address, true), "esGplx.setHandler(stakedGplpTracker)")
  await sendTxn(esGplx.setHandler(gplxVester.address, true), "esGplx.setHandler(gplxVester)")
  await sendTxn(esGplx.setHandler(gplpVester.address, true), "esGplx.setHandler(gplpVester)")

  await sendTxn(esGplx.setMinter(gplxVester.address, true), "esGplx.setMinter(gplxVester)")
  await sendTxn(esGplx.setMinter(gplpVester.address, true), "esGplx.setMinter(gplpVester)")

  await sendTxn(gplxVester.setHandler(rewardRouter.address, true), "gplxVester.setHandler(rewardRouter)")
  await sendTxn(gplpVester.setHandler(rewardRouter.address, true), "gplpVester.setHandler(rewardRouter)")

  await sendTxn(feeGplxTracker.setHandler(gplxVester.address, true), "feeGplxTracker.setHandler(gplxVester)")
  await sendTxn(stakedGplpTracker.setHandler(gplpVester.address, true), "stakedGplpTracker.setHandler(gplpVester)")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
