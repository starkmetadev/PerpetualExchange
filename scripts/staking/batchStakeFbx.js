const { deployContract, contractAt, sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const stakeGplxList = require("../../data/gplxMigration/stakeGplxList6.json")

async function main() {
  const wallet = { address: "0x5F799f365Fa8A2B60ac0429C48B153cA5a6f0Cf8" }
  const gplx = await contractAt("GPLX", "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a");
  const rewardRouter = await contractAt("RewardRouter", "0xc73d553473dC65CE56db96c58e6a091c20980fbA")
  const stakedGplxTracker = await contractAt("RewardTracker", "0x908C4D94D34924765f1eDc22A1DD098397c59dD4")
  const shouldStake = false

  console.log("processing list", stakeGplxList.length)

  // await sendTxn(gplx.setMinter(wallet.address, true), "gplx.setMinter")
  // await sendTxn(gplx.mint(wallet.address, expandDecimals(5500000, 18)), "gplx.mint")
  // await sendTxn(gplx.approve(stakedGplxTracker.address, expandDecimals(5500000, 18)), "gplx.approve(stakedGplxTracker)")
  // await sendTxn(rewardRouter.batchStakeGplxForAccount(["0x5F799f365Fa8A2B60ac0429C48B153cA5a6f0Cf8"], [1], { gasLimit: 30000000 }), "rewardRouter.batchStakeGplxForAccount")

  if (!shouldStake) {
    for (let i = 0; i < stakeGplxList.length; i++) {
      const item = stakeGplxList[i]
      const account = item.address
      const stakedAmount = await stakedGplxTracker.stakedAmounts(account)
      console.log(`${account} : ${stakedAmount.toString()}`)
    }
    return
  }

  const batchSize = 30
  let accounts = []
  let amounts = []

  for (let i = 0; i < stakeGplxList.length; i++) {
    const item = stakeGplxList[i]
    accounts.push(item.address)
    amounts.push(item.balance)

    if (accounts.length === batchSize) {
      console.log("accounts", accounts)
      console.log("amounts", amounts)
      console.log("sending batch", i, accounts.length, amounts.length)
      await sendTxn(rewardRouter.batchStakeGplxForAccount(accounts, amounts), "rewardRouter.batchStakeGplxForAccount")

      const account = accounts[0]
      const amount = amounts[0]
      const stakedAmount = await stakedGplxTracker.stakedAmounts(account)
      console.log(`${account}: ${amount.toString()}, ${stakedAmount.toString()}`)

      accounts = []
      amounts = []
    }
  }

  if (accounts.length > 0) {
    console.log("sending final batch", stakeGplxList.length, accounts.length, amounts.length)
    await sendTxn(rewardRouter.batchStakeGplxForAccount(accounts, amounts), "rewardRouter.batchStakeGplxForAccount")
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
