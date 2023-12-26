const { contractAt, sendTxn } = require("../shared/helpers")

const wallet = { address: "0x5F799f365Fa8A2B60ac0429C48B153cA5a6f0Cf8" }
const timelock = { address: "0x59c46156ED614164eC66A3CFa5822797f533c902" }

async function printRewardTracker(rewardTracker, label) {
  // console.log(label, "inPrivateTransferMode", await rewardTracker.inPrivateTransferMode())
  // console.log(label, "inPrivateStakingMode", await rewardTracker.inPrivateStakingMode())
  // console.log(label, "inPrivateClaimingMode", await rewardTracker.inPrivateClaimingMode())
  console.log(label, "isHandler", await rewardTracker.isHandler(wallet.address))
  console.log(label, "gov", await rewardTracker.gov())
}

async function updateHandler(rewardTracker, label) {
  await sendTxn(rewardTracker.setHandler(wallet.address, false), `${label}, rewardTracker.setHandler`)
}

async function printToken(token, label) {
  console.log(label, "inPrivateTransferMode", await token.inPrivateTransferMode())
  console.log(label, "isHandler", await token.isHandler(wallet.address))
  console.log(label, "isMinter", await token.isMinter(wallet.address))
  console.log(label, "gov", await token.gov())
}

async function printUsdg(token, label) {
  console.log(label, "isVault", await token.vaults(wallet.address))
  console.log(label, "gov", await token.gov())
}

async function updateToken(token, label) {
  // await sendTxn(token.removeAdmin(wallet.address), `${label}, token.removeAdmin`)
  await sendTxn(token.setMinter(wallet.address, false), `${label}, token.setMinter`)
}

async function updateGov(contract, label) {
  await sendTxn(contract.setGov(timelock.address), `${label}.setGov`)
}

async function signalGov(prevGov, contract, nextGov, label) {
  await sendTxn(prevGov.signalSetGov(contract.address, nextGov.address), `${label}.signalSetGov`)
}

async function updateRewardTrackerGov(rewardTracker, label) {
  const distributorAddress = await rewardTracker.distributor()
  const distributor = await contractAt("RewardDistributor", distributorAddress)
  await sendTxn(rewardTracker.setGov(timelock.address), `${label}.setGov`)
  await sendTxn(distributor.setGov(timelock.address), `${label}.distributor.setGov`)
}

async function main() {
  const stakedGplxTracker = await contractAt("RewardTracker", "0x2bD10f8E93B3669b6d42E74eEedC65dd1B0a1342")
  const bonusGplxTracker = await contractAt("RewardTracker", "0x908C4D94D34924765f1eDc22A1DD098397c59dD4")
  const feeGplxTracker = await contractAt("RewardTracker", "0x4d268a7d4C16ceB5a606c173Bd974984343fea13")

  const stakedGplpTracker = await contractAt("RewardTracker", "0x9e295B5B976a184B14aD8cd72413aD846C299660")
  const feeGplpTracker = await contractAt("RewardTracker", "0xd2D1162512F927a7e282Ef43a362659E4F2a728F")

  await printRewardTracker(stakedGplxTracker, "stakedGplxTracker")
  await printRewardTracker(bonusGplxTracker, "bonusGplxTracker")
  await printRewardTracker(feeGplxTracker, "feeGplxTracker")

  await printRewardTracker(stakedGplpTracker, "stakedGplpTracker")
  await printRewardTracker(feeGplpTracker, "feeGplpTracker")

  const gplp = await contractAt("MintableBaseToken", "0x01234181085565ed162a948b6a5e88758CD7c7b8")
  const usdg = await contractAt("USDG", "0xc0253c3cC6aa5Ab407b5795a04c28fB063273894")
  // const gplx = await contractAt("MintableBaseToken", "0x62edc0692BD897D2295872a9FFCac5425011c661")
  // const esGplx = await contractAt("MintableBaseToken", "0xFf1489227BbAAC61a9209A08929E4c2a526DdD17")
  const bnGplx = await contractAt("MintableBaseToken", "0x8087a341D32D445d9aC8aCc9c14F5781E04A26d2")

  await printToken(gplp, "gplp")
  await printUsdg(usdg, "usdg")
  // await printToken(gplx, "gplx")
  // await printToken(esGplx, "esGplx")
  await printToken(bnGplx, "bnGplx")

  // const prevGov = await contractAt("Timelock", "0x4a3930b629f899fe19c1f280c73a376382d61a78")
  // const nextGov = await contractAt("Timelock", "0x09214C0A3594fbcad59A58099b0A63E2B29b15B8")

  // await signalGov(prevGov, gplp, nextGov, "gplp")
  // await signalGov(prevGov, gplx, nextGov, "gplx")
  // await signalGov(prevGov, esGplx, nextGov, "esGplx")
  // await signalGov(prevGov, bnGplx, nextGov, "bnGplx")

  await updateToken(gplx, "gplx")
  await updateToken(esGplx, "esGplx")
  await updateToken(bnGplx, "bnGplx")

  await updateHandler(stakedGplxTracker, "stakedGplxTracker")
  await updateHandler(bonusGplxTracker, "bonusGplxTracker")
  await updateHandler(feeGplxTracker, "feeGplxTracker")
  await updateHandler(stakedGplpTracker, "stakedGplpTracker")
  await updateHandler(feeGplpTracker, "feeGplpTracker")

  await updateRewardTrackerGov(stakedGplxTracker, "stakedGplxTracker")

  await updateRewardTrackerGov(bonusGplxTracker, "bonusGplxTracker")
  await updateRewardTrackerGov(feeGplxTracker, "feeGplxTracker")
  await updateRewardTrackerGov(stakedGplpTracker, "stakedGplpTracker")
  await updateRewardTrackerGov(feeGplpTracker, "feeGplpTracker")

  await updateGov(gplp, "gplp")
  await updateGov(usdg, "usdg")
  // await updateGov(gplx, "gplx")
  // await updateGov(esGplx, "esGplx")
  await updateGov(bnGplx, "bnGplx")

  const vault = await contractAt("Vault", "0x9ab2De34A33fB459b538c43f251eB825645e8595")
  const vaultPriceFeedAddress = await vault.priceFeed()
  const vaultPriceFeed = await contractAt("VaultPriceFeed", vaultPriceFeedAddress)
  const gplpManager = await contractAt("GplpManager", "0xe1ae4d4b06A5Fe1fc288f6B4CD72f9F8323B107F")
  const router = await contractAt("Router", "0x5F719c2F1095F7B9fc68a68e35B51194f4b6abe8")

  await updateGov(vault, "vault")
  await updateGov(vaultPriceFeed, "vaultPriceFeed")
  await updateGov(gplpManager, "gplpManager")
  await updateGov(router, "router")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
