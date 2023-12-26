const { deployContract, contractAt, sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'pulse');

async function getArbValues() {
  const vault = await contractAt("Vault", "0x489ee077994B6658eAfA855C308275EAd8097C4A")
  const tokenManager = { address: "0xddDc546e07f1374A07b270b7d863371e575EA96A" }
  const flpManager = { address: "0x321F653eED006AD1C29D174e17d96351BDe22649" }

  const positionRouter = { address: "0x3D6bA331e3D9702C5e8A8d254e5d8a285F223aba" }
  const positionManager = { address: "0x956618e5B6996919eB6B943aBf36910DdabC9a0f" }
  const fbx = { address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a" }

  return { vault, tokenManager, flpManager, positionRouter, positionManager, fbx }
}

async function getAvaxValues() {
  const vault = await contractAt("Vault", "0x9e34FDE4Bf55061a1805C11654C21acCd34d511E")
  const tokenManager = { address: "0x63F2323eE76842397957Edfd65A39DAEb63cf801" }
  const flpManager = { address: "0x3a417b2949d59B129e5C6c0A52114335C780B9AE" }

  const positionRouter = { address: "0x195256074192170d1530527abC9943759c7167d8" }
  const positionManager = { address: "0xAaf69ca8d44d74EAD76a86f25001cfC44515e94E" }
  const fbx = { address: "0x62edc0692BD897D2295872a9FFCac5425011c661" }

  return { vault, tokenManager, flpManager, positionRouter, positionManager, fbx }
}

async function getGoerliValues() {
  const vault = await contractAt("Vault", "0x815688F3499aE6194A006EDB2185Fc0dd9Bd7463")
  const tokenManager = { address: "0x04CA48593f9cc59C1F6166aF57D2Eb00B231edc4" }
  const flpManager = { address: "0x803f874315Dd373D4F56cfD322386334a09aa39b" }

  const positionRouter = { address: "0x4aa1f522aC1a208DAde1Ca8500423971E7b634c7" }
  const positionManager = { address: "0x61c76EEfdB415355F8D3B60d20E4D91bF17Bd619" }
  const fbx = { address: "0x2F85207AAfF05040e7fcE48c5ed80d01c4C38597" }

  return { vault, tokenManager, flpManager, positionRouter, positionManager, fbx }
}

async function getCronosValues() {
  const vault = await contractAt("Vault", "0x26e5FbFbfd38a27D5777C9C9CC5543e687E637D8")
  const tokenManager = { address: "0x4038a0F91351A0C9168D293d86E8d10241BBaBe2" }
  const flpManager = { address: "0x32889DD3209b32fEc343A4c8081f54aBEFFC06b8" }

  const positionRouter = { address: "0xb8753D850Ee02103168428e8EE482936D9Cde045" }
  const positionManager = { address: "0x75be73dAB8EcF685DdA1701b23c12dBb8eDDf07b" }
  const fbx = { address: "0x1542bA4CA0fb6D1B4476a933B292002fd1959A52" }

  return { vault, tokenManager, flpManager, positionRouter, positionManager, fbx }
}

async function getButaneValues() {
  const vault = await contractAt("Vault", "0xcCF72325ec74DE420c40D5682f0698877f64296C")
  const tokenManager = { address: "0x09c688B5F4518B656d957D5Bc55141bbAb337109" }
  const flpManager = { address: "0x420b43613Bf4Ce3120F2ec0Ccad8C0C3eE799025" }

  const positionRouter = { address: "0x4c18b32A41a03B01D3520b2Ae3bCf11a01e59BFD" }
  const positionManager = { address: "0x92284DDFD7d7399cD5637Fb86749fAdDaCf25229" }
  const fbx = { address: "0x7Ae4C9Be5053603c980b7101858e234594C77dB5" }

  return { vault, tokenManager, flpManager, positionRouter, positionManager, fbx }
}

async function getPulseValues() {
  const vault = await contractAt("Vault", "0xC2311efFE60b0dC2491148Ff1bd46F08D64ADC98")
  const tokenManager = { address: "0xb0bCbE2E7D4507066a833CFf9BAFE6b3b6c49937" }
  const flpManager = { address: "0xcBD1522BB2745963456338a9477a018680608C17" }

  const positionRouter = { address: "0x9Be3931A525584017388e334FeC0de35c7cf8aC0" }
  const positionManager = { address: "0x5b1978E398b897CFc15c017bEC80c0D6dAaa9cEB" }
  const fbx = { address: "0xccb0d8790bbb82754d6d2f79e61ceEE8582704c6" }

  return { vault, tokenManager, flpManager, positionRouter, positionManager, fbx }
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
  const admin = "0x7B9F1168fEFAd14403035066cf9c6929a24FB394";
  const buffer = 1 // 24 * 60 * 60 //1 day 86400
  const maxTokenSupply = expandDecimals("200000000", 18)

  const { vault, tokenManager, flpManager, positionRouter, positionManager, fbx } = await getValues()
  const mintReceiver = tokenManager

  console.log("Timelock", {
    _admin: admin,
    _buffer: buffer,
    _tokenManager: tokenManager.address,
    _mintReceiver: mintReceiver.address,
    _gplpManager: flpManager.address,
    _maxTokenSupply: maxTokenSupply,
    _marginFeeBasisPoints: 10, // marginFeeBasisPoints 0.1%
    _maxMarginFeeBasisPoints: 500 // maxMarginFeeBasisPoints 5%
  })

  const timelock = await deployContract("Timelock", [{
    _admin: admin,
    _buffer: buffer,
    _tokenManager: tokenManager.address,
    _mintReceiver: mintReceiver.address,
    _gplpManager: flpManager.address,
    _maxTokenSupply: maxTokenSupply,
    _marginFeeBasisPoints: 10, // marginFeeBasisPoints 0.1%
    _maxMarginFeeBasisPoints: 500 // maxMarginFeeBasisPoints 5%
  }
  ], "Timelock")

  const deployedTimelock = await contractAt("Timelock", timelock.address)

  await sendTxn(deployedTimelock.setShouldToggleIsLeverageEnabled(true), "deployedTimelock.setShouldToggleIsLeverageEnabled(true)")
  await sendTxn(deployedTimelock.setContractHandler(positionRouter.address, true), "deployedTimelock.setContractHandler(positionRouter)")
  await sendTxn(deployedTimelock.setContractHandler(positionManager.address, true), "deployedTimelock.setContractHandler(positionManager)")

  // // update gov of vault
  const vaultGov = await contractAt("Timelock", await vault.gov())

  await sendTxn(vaultGov.signalSetGov(vault.address, deployedTimelock.address), "vaultGov.signalSetGov")
  await sendTxn(deployedTimelock.signalSetGov(vault.address, vaultGov.address), "deployedTimelock.signalSetGov(vault)")

  const signers = [
    "0xEF5Fa22834316D7A5eBFD55875706B4ec26A9591"
  ]

  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i]
    await sendTxn(deployedTimelock.setContractHandler(signer, true), `deployedTimelock.setContractHandler(${signer})`)
  }

  const keepers = [
    "0xEF5Fa22834316D7A5eBFD55875706B4ec26A9591" // GMX deployer: avalanche: 0x5F799f365Fa8A2B60ac0429C48B153cA5a6f0Cf8 -> call batchSender
  ]

  for (let i = 0; i < keepers.length; i++) {
    const keeper = keepers[i]
    await sendTxn(deployedTimelock.setKeeper(keeper, true), `deployedTimelock.setKeeper(${keeper})`)
  }

  await sendTxn(deployedTimelock.signalApprove(fbx.address, admin, "1000000000000000000"), "deployedTimelock.signalApprove")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
