const { deployContract, contractAt, sendTxn, signers, updateTokensPerInterval } = require("../shared/helpers")
const { expandDecimals, bigNumberify } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'pulse');

const shouldSendTxn = true

const monthlyEsGplxForGplpOnArb = expandDecimals(toInt("0"), 18)
const monthlyEsGplxForGplpOnAvax = expandDecimals(toInt("0"), 18)

async function getStakedAmounts() {
  const arbStakedGplxTracker = await contractAt("RewardTracker", "0x908C4D94D34924765f1eDc22A1DD098397c59dD4", signers.arbitrum)
  const arbStakedGplxAndEsGplx =await arbStakedGplxTracker.totalSupply()

  const avaxStakedGplxTracker = await contractAt("RewardTracker", "0x908C4D94D34924765f1eDc22A1DD098397c59dD4", signers.avax)
  const avaxStakedGplxAndEsGplx =await avaxStakedGplxTracker.totalSupply()

  return {
    arbStakedGplxAndEsGplx,
    avaxStakedGplxAndEsGplx
  }
}

async function getArbValues() {
  const gplxRewardTracker = await contractAt("RewardTracker", "0x908C4D94D34924765f1eDc22A1DD098397c59dD4")
  const gplpRewardTracker = await contractAt("RewardTracker", "0x1aDDD80E6039594eE970E5872D247bf0414C8903")
  const tokenDecimals = 18
  const monthlyEsGplxForGplp = monthlyEsGplxForGplpOnArb

  return { tokenDecimals, gplxRewardTracker, gplpRewardTracker, monthlyEsGplxForGplp }
}

async function getAvaxValues() {
  const gplxRewardTracker = await contractAt("RewardTracker", "0x2bD10f8E93B3669b6d42E74eEedC65dd1B0a1342")
  const gplpRewardTracker = await contractAt("RewardTracker", "0x9e295B5B976a184B14aD8cd72413aD846C299660")
  const tokenDecimals = 18
  const monthlyEsGplxForGplp = monthlyEsGplxForGplpOnAvax

  return { tokenDecimals, gplxRewardTracker, gplpRewardTracker, monthlyEsGplxForGplp }
}

function getValues() {
  if (network === "arbitrum") {
    return getArbValues()
  }

  if (network === "avax") {
    return getAvaxValues()
  }
}

function toInt(value) {
  return parseInt(value.replaceAll(",", ""))
}

async function main() {
  const { arbStakedGplxAndEsGplx, avaxStakedGplxAndEsGplx } = await getStakedAmounts()
  const { tokenDecimals, gplxRewardTracker, gplpRewardTracker, monthlyEsGplxForGplp } = await getValues()

  const stakedAmounts = {
    arbitrum: {
      total: arbStakedGplxAndEsGplx
    },
    avax: {
      total: avaxStakedGplxAndEsGplx
    }
  }

  let totalStaked = bigNumberify(0)

  for (const net in stakedAmounts) {
    totalStaked = totalStaked.add(stakedAmounts[net].total)
  }

  const totalEsGplxRewards = expandDecimals(50000, tokenDecimals)
  const secondsPerMonth = 28 * 24 * 60 * 60

  const gplxRewardDistributor = await contractAt("RewardDistributor", await gplxRewardTracker.distributor())

  const gplxCurrentTokensPerInterval = await gplxRewardDistributor.tokensPerInterval()
  const gplxNextTokensPerInterval = totalEsGplxRewards.mul(stakedAmounts[network].total).div(totalStaked).div(secondsPerMonth)
  const gplxDelta = gplxNextTokensPerInterval.sub(gplxCurrentTokensPerInterval).mul(10000).div(gplxCurrentTokensPerInterval)

  console.log("gplxCurrentTokensPerInterval", gplxCurrentTokensPerInterval.toString())
  console.log("gplxNextTokensPerInterval", gplxNextTokensPerInterval.toString(), `${gplxDelta.toNumber() / 100.00}%`)

  const gplpRewardDistributor = await contractAt("RewardDistributor", await gplpRewardTracker.distributor())

  const gplpCurrentTokensPerInterval = await gplpRewardDistributor.tokensPerInterval()
  const gplpNextTokensPerInterval = monthlyEsGplxForGplp.div(secondsPerMonth)

  console.log("gplpCurrentTokensPerInterval", gplpCurrentTokensPerInterval.toString())
  console.log("gplpNextTokensPerInterval", gplpNextTokensPerInterval.toString())

  if (shouldSendTxn) {
    await updateTokensPerInterval(gplxRewardDistributor, gplxNextTokensPerInterval, "gplxRewardDistributor")
    await updateTokensPerInterval(gplpRewardDistributor, gplpNextTokensPerInterval, "gplpRewardDistributor")
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
