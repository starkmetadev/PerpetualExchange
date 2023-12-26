const { deployContract, contractAt, sendTxn, readCsv } = require("../shared/helpers")
const { expandDecimals, bigNumberify } = require("../../test/shared/utilities")

const path = require('path')
const fs = require('fs')
const parse = require('csv-parse')

const inputDir = path.resolve(__dirname, "../..") + "/data/bonds/"

const network = (process.env.HARDHAT_NETWORK || 'pulse');

const inputFile = inputDir + "2022-09-14_transfers.csv"
const shouldSendTxns = true

async function getArbValues() {
  const esGplx = await contractAt("EsGPLX", "0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA")
  const esGplxBatchSender = await contractAt("EsGplxBatchSender", "0xc3828fa579996090Dc7767E051341338e60207eF")

  const vestWithGplxOption = "0x544a6ec142Aa9A7F75235fE111F61eF2EbdC250a"
  const vestWithGplpOption = "0x9d8f6f6eE45275A5Ca3C6f6269c5622b1F9ED515"

  const gplxVester = await contractAt("Vester", "0x199070DDfd1CFb69173aa2F7e20906F26B363004")
  const gplpVester = await contractAt("Vester", "0xA75287d2f8b217273E7FCD7E86eF07D33972042E")

  return { esGplx, esGplxBatchSender, vestWithGplxOption, vestWithGplpOption, gplxVester, gplpVester }
}

async function getAvaxValues() {
  const esGplx = await contractAt("EsGPLX", "0xFf1489227BbAAC61a9209A08929E4c2a526DdD17")
  const esGplxBatchSender = await contractAt("EsGplxBatchSender", "0xc9baFef924159138697e72899a2753a3Dc8D1F4d")
  const vestWithGplxOption = "0x171a321A78dAE0CDC0Ba3409194df955DEEcA746"
  const vestWithGplpOption = "0x28863Dd19fb52DF38A9f2C6dfed40eeB996e3818"

  const gplxVester = await contractAt("Vester", "0x472361d3cA5F49c8E633FB50385BfaD1e018b445")
  const gplpVester = await contractAt("Vester", "0x62331A7Bd1dfB3A7642B7db50B5509E57CA3154A")

  return { esGplx, esGplxBatchSender, vestWithGplxOption, vestWithGplpOption, gplxVester, gplpVester }
}

async function main() {
  const wallet = { address: "0x5F799f365Fa8A2B60ac0429C48B153cA5a6f0Cf8" }

  const values = network === "arbitrum" ? await getArbValues() : await getAvaxValues()
  const { esGplx, esGplxBatchSender, vestWithGplxOption, vestWithGplpOption, gplxVester, gplpVester } = values

  const txns = await readCsv(inputFile)
  console.log("processing list", txns.length)

  const vestWithGplxAccounts = []
  const vestWithGplxAmounts = []

  const vestWithGplpAccounts = []
  const vestWithGplpAmounts = []

  let totalEsGplx = bigNumberify(0)

  for (let i = 0; i < txns.length; i++) {
    const txn = txns[i]
    if (txn.Method !== "Transfer") {
      continue
    }

    const amount = ethers.utils.parseUnits(txn.Quantity, 18)

    if (txn.To.toLowerCase() === vestWithGplxOption.toLowerCase()) {
      vestWithGplxAccounts.push(txn.From)
      vestWithGplxAmounts.push(amount)
      totalEsGplx = totalEsGplx.add(amount)
    }

    if (txn.To.toLowerCase() === vestWithGplpOption.toLowerCase()) {
      vestWithGplpAccounts.push(txn.From)
      vestWithGplpAmounts.push(amount)
      totalEsGplx = totalEsGplx.add(amount)
    }
  }

  console.log("vestWithGplxAccounts", vestWithGplxAccounts.length)
  console.log("vestWithGplpAccounts", vestWithGplpAccounts.length)
  console.log("totalEsGplx", totalEsGplx.toString(), ethers.utils.formatUnits(totalEsGplx, 18))

  if (shouldSendTxns) {
    if (vestWithGplxAccounts.length > 0) {
      await sendTxn(esGplxBatchSender.send(gplxVester.address, 4, vestWithGplxAccounts, vestWithGplxAmounts), "esGplxBatchSender.send(gplxVester)")
    }
    if (vestWithGplpAccounts.length > 0) {
      await sendTxn(esGplxBatchSender.send(gplpVester.address, 320, vestWithGplpAccounts, vestWithGplpAmounts), "esGplxBatchSender.send(gplpVester)")
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
