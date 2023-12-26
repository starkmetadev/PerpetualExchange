const { getFrameSigner, deployContract, contractAt , sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units");
const { getArgumentForSignature } = require("typechain");

const network = (process.env.HARDHAT_NETWORK || 'pulse');
const tokens = require('./tokens')[network];

async function getArbTestnetValues() {
  return { vaultAddress: "0xBc9BC47A7aB63db1E0030dC7B60DDcDe29CF4Ffb", gasLimit: 12500000 }
}

async function getArbValues() {
  return { vaultAddress: "0x489ee077994B6658eAfA855C308275EAd8097C4A", gasLimit: 12500000 }
}

async function getAvaxValues() {
  return { vaultAddress: "0x2a5bae3eaec36d147dFE859b1a68F1A5eCCB0dd5", gasLimit: 12500000 }
}

async function getGoerliValues() {
  return { vaultAddress: "0xDAaD544a99cE12348375f7eE87ED7E135df6c251", gasLimit: 12500000 }
}

async function getCronosValues() {
  return { vaultAddress: "0x26e5FbFbfd38a27D5777C9C9CC5543e687E637D8", gasLimit: 25000000 }
}

async function getButaneValues() {
  return { vaultAddress: "0xcCF72325ec74DE420c40D5682f0698877f64296C", gasLimit: 8000000 }
}

async function getPulseValues() {
  return { vaultAddress: "0xC2311efFE60b0dC2491148Ff1bd46F08D64ADC98", gasLimit: 800000000 }
}

async function getValues() {
  if (network === "avax") {
    return await getAvaxValues()
  } else if (network === "arbitrumTestnet") {
    return await getArbTestnetValues()
  } else if (network === "arbitrum") {
    return await getArbValues()
  } else if (network === "goerli") {
    return await getGoerliValues()
  } else if (network === "cronos") {
    return await getCronosValues()
  } else if (network === "butane") {
    return await getButaneValues()
  } else if (network === "pulse") {
    return await getPulseValues()
  }
}

async function main() {
  const { vaultAddress, gasLimit } = await getValues()
  const gov = { address: "0x7B9F1168fEFAd14403035066cf9c6929a24FB394" }
  const shortsTracker = await deployContract("ShortsTracker", [vaultAddress], "ShortsTracker")
  // const shortsTracker = await contractAt("ShortsTracker", "0x995D7D1bFC5916DF54837520dB852E8863d2437D")
  await sendTxn(shortsTracker.setGov(gov.address), "shortsTracker.setGov")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
