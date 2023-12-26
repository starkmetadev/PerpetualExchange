const { getFrameSigner, deployContract, contractAt, sendTxn } = require("../shared/helpers")

const network = (process.env.HARDHAT_NETWORK || 'pulse');

async function getArbValues() {
  const signer = await getFrameSigner()

  const esGplx = await contractAt("EsGPLX", "0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA")
  const esGplxGov = await contractAt("Timelock", await esGplx.gov(), signer)
  const gplxVester = await contractAt("Vester", "0x199070DDfd1CFb69173aa2F7e20906F26B363004")
  const gplxVesterGov = await contractAt("Timelock", await gplxVester.gov(), signer)
  const gplpVester = await contractAt("Vester", "0xA75287d2f8b217273E7FCD7E86eF07D33972042E")
  const gplpVesterGov = await contractAt("Timelock", await gplpVester.gov(), signer)

  return { esGplx, esGplxGov, gplxVester, gplxVesterGov, gplpVester, gplpVesterGov }
}

async function getAvaxValues() {
  const signer = await getFrameSigner()

  const esGplx = await contractAt("EsGPLX", "0xFf1489227BbAAC61a9209A08929E4c2a526DdD17")
  const esGplxGov = await contractAt("Timelock", await esGplx.gov(), signer)
  const gplxVester = await contractAt("Vester", "0x472361d3cA5F49c8E633FB50385BfaD1e018b445")
  const gplxVesterGov = await contractAt("Timelock", await gplxVester.gov(), signer)
  const gplpVester = await contractAt("Vester", "0x62331A7Bd1dfB3A7642B7db50B5509E57CA3154A")
  const gplpVesterGov = await contractAt("Timelock", await gplpVester.gov(), signer)

  return { esGplx, esGplxGov, gplxVester, gplxVesterGov, gplpVester, gplpVesterGov }
}

async function main() {
  const method = network === "arbitrum" ? getArbValues : getAvaxValues
  const { esGplx, esGplxGov, gplxVester, gplxVesterGov, gplpVester, gplpVesterGov } = await method()

  const esGplxBatchSender = await deployContract("EsGplxBatchSender", [esGplx.address])

  console.log("esGplx", esGplx.address)
  console.log("esGplxGov", esGplxGov.address)
  console.log("gplxVester", gplxVester.address)
  console.log("gplxVesterGov", gplxVesterGov.address)
  console.log("gplpVester", gplpVester.address)
  console.log("gplpVesterGov", gplpVesterGov.address)

  await sendTxn(esGplxGov.signalSetHandler(esGplx.address, esGplxBatchSender.address, true), "esGplxGov.signalSetHandler")
  await sendTxn(gplxVesterGov.signalSetHandler(gplxVester.address, esGplxBatchSender.address, true), "gplxVesterGov.signalSetHandler")
  await sendTxn(gplpVesterGov.signalSetHandler(gplpVester.address, esGplxBatchSender.address, true), "gplpVesterGov.signalSetHandler")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
