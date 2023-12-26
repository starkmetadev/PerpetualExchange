const { deployContract, contractAt, sendTxn, getFrameSigner } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');

async function getArbValues() {
  const tokenManager = { address: "0xddDc546e07f1374A07b270b7d863371e575EA96A" }

  return { tokenManager }
}

async function getAvaxValues() {
  const tokenManager = { address: "0x3D9b1c8E3ddB40Ce2Fb605b2893592e9Ef1CD602" }

  return { tokenManager }
}

async function getGoerliValues() {
  const tokenManager = { address: "0x72fa790B516fFBCBBa7CD97815629053223dfB41" }

  return { tokenManager }
}

async function getCronosValues() {
  const tokenManager = { address: "0x4038a0F91351A0C9168D293d86E8d10241BBaBe2" }

  return { tokenManager }
}

async function getButaneValues() {
  const tokenManager = { address: "0x09c688B5F4518B656d957D5Bc55141bbAb337109" }

  return { tokenManager }
}

async function getPulseValues() {
  const tokenManager = { address: "0xb0bCbE2E7D4507066a833CFf9BAFE6b3b6c49937" }

  return { tokenManager }
}

async function getValues() {
  if (network === "arbitrum") {
    return getArbValues()
  }

  if (network === "avax") {
    return getAvaxValues()
  }

  if (network === "goerli") {
    return getGoerliValues()
  }

  if (network === "cronos") {
    return getCronosValues()
  }

  if (network === "butane") {
    return getButaneValues()
  }

  if (network === "pulse") {
    return getPulseValues()
  }
}

async function main() {
  // const signer = await getFrameSigner()

  const admin = "0x7B9F1168fEFAd14403035066cf9c6929a24FB394"
  const buffer = 1// 24 * 60 * 60

  const { tokenManager } = await getValues()

  const timelock = await deployContract("PriceFeedTimelock", [
    admin,
    buffer,
    tokenManager.address
  ], "Timelock")

  const deployedTimelock = await contractAt("PriceFeedTimelock", timelock.address)

  const signers = [
    "0xEF5Fa22834316D7A5eBFD55875706B4ec26A9591", // coinflipcanada
  ]

  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i]
    await sendTxn(deployedTimelock.setContractHandler(signer, true), `deployedTimelock.setContractHandler(${signer})`)
  }

  const keepers = [
    "0xEF5Fa22834316D7A5eBFD55875706B4ec26A9591" // X
  ]

  for (let i = 0; i < keepers.length; i++) {
    const keeper = keepers[i]
    await sendTxn(deployedTimelock.setKeeper(keeper, true), `deployedTimelock.setKeeper(${keeper})`)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
