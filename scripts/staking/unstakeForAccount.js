const { deployContract, contractAt, sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

async function main() {
  const wallet = { address: "0x5F799f365Fa8A2B60ac0429C48B153cA5a6f0Cf8" }

  const account = "0x6eA748d14f28778495A3fBa3550a6CdfBbE555f9"
  const unstakeAmount = "79170000000000000000"

  const rewardRouter = await contractAt("RewardRouter", "0x1b8911995ee36F4F95311D1D9C1845fA18c56Ec6")
  const gplx = await contractAt("GPLX", "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a");
  const bnGplx = await contractAt("MintableBaseToken", "0x35247165119B69A40edD5304969560D0ef486921");
  const stakedGplxTracker = await contractAt("RewardTracker", "0x908C4D94D34924765f1eDc22A1DD098397c59dD4")
  const bonusGplxTracker = await contractAt("RewardTracker", "0x4d268a7d4C16ceB5a606c173Bd974984343fea13")
  const feeGplxTracker = await contractAt("RewardTracker", "0xd2D1162512F927a7e282Ef43a362659E4F2a728F")

  // const gasLimit = 30000000

  // await sendTxn(feeGplxTracker.setHandler(wallet.address, true, { gasLimit }), "feeGplxTracker.setHandler")
  // await sendTxn(bonusGplxTracker.setHandler(wallet.address, true, { gasLimit }), "bonusGplxTracker.setHandler")
  // await sendTxn(stakedGplxTracker.setHandler(wallet.address, true, { gasLimit }), "stakedGplxTracker.setHandler")

  const stakedAmount = await stakedGplxTracker.stakedAmounts(account)
  console.log(`${account} staked: ${stakedAmount.toString()}`)
  console.log(`unstakeAmount: ${unstakeAmount.toString()}`)

  await sendTxn(feeGplxTracker.unstakeForAccount(account, bonusGplxTracker.address, unstakeAmount, account), "feeGplxTracker.unstakeForAccount")
  await sendTxn(bonusGplxTracker.unstakeForAccount(account, stakedGplxTracker.address, unstakeAmount, account), "bonusGplxTracker.unstakeForAccount")
  await sendTxn(stakedGplxTracker.unstakeForAccount(account, gplx.address, unstakeAmount, account), "stakedGplxTracker.unstakeForAccount")

  await sendTxn(bonusGplxTracker.claimForAccount(account, account), "bonusGplxTracker.claimForAccount")

  const bnGplxAmount = await bnGplx.balanceOf(account)
  console.log(`bnGplxAmount: ${bnGplxAmount.toString()}`)

  await sendTxn(feeGplxTracker.stakeForAccount(account, account, bnGplx.address, bnGplxAmount), "feeGplxTracker.stakeForAccount")

  const stakedBnGplx = await feeGplxTracker.depositBalances(account, bnGplx.address)
  console.log(`stakedBnGplx: ${stakedBnGplx.toString()}`)

  const reductionAmount = stakedBnGplx.mul(unstakeAmount).div(stakedAmount)
  console.log(`reductionAmount: ${reductionAmount.toString()}`)
  await sendTxn(feeGplxTracker.unstakeForAccount(account, bnGplx.address, reductionAmount, account), "feeGplxTracker.unstakeForAccount")
  await sendTxn(bnGplx.burn(account, reductionAmount), "bnGplx.burn")

  const gplxAmount = await gplx.balanceOf(account)
  console.log(`gplxAmount: ${gplxAmount.toString()}`)

  await sendTxn(gplx.burn(account, unstakeAmount), "gplx.burn")
  const nextGplxAmount = await gplx.balanceOf(account)
  console.log(`nextGplxAmount: ${nextGplxAmount.toString()}`)

  const nextStakedAmount = await stakedGplxTracker.stakedAmounts(account)
  console.log(`nextStakedAmount: ${nextStakedAmount.toString()}`)

  const nextStakedBnGplx = await feeGplxTracker.depositBalances(account, bnGplx.address)
  console.log(`nextStakedBnGplx: ${nextStakedBnGplx.toString()}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
