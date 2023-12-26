// const { utils } = require("ethers");
require('ethers')
const crypto = require( 'crypto' );
const { deployContract, contractAt , sendTxn } = require("../shared/helpers");

async function main() {
    // const PriceFeedExt_pls = await deployContract("PriceFeedExt", ["PLS Price", "8"])

    // await sendTxn(PriceFeedExt_pls.initialize(
    //     false,
    //     true,
    //     "0xa1077a294dde1b09bb078844df40758a5d0f9a27",
    //     "0xa1077a294dde1b09bb078844df40758a5d0f9a27",
    //     "0x322df7921f28f1146cdf62afdac0d6bc0ab80711",
    //     "0x0cb6f5a34ad42ec934882a05265a7d5f59b51a2f"), "PLS PriceFeedExt.initialize")

    const PriceFeedExt_pls = await contractAt("PriceFeedExt", "0x2214DcB68D7379797B480636DdbA967529269598")
    let info = await PriceFeedExt_pls.latestAnswer()
    console.log("PLS price", info.price.toString())
    
    // const PriceFeedExt_wbtc = await deployContract("PriceFeedExt", ["WBTC Price", "8"])

    // await sendTxn(PriceFeedExt_wbtc.initialize(
    //     false,
    //     false,
    //     PriceFeedExt_pls.address,
    //     "0xb17d901469b9208b17d916112988a3fed19b5ca1",
    //     "0xdb82b0919584124a0eb176ab136a0cc9f148b2d1",
    //     "0xa1077a294dde1b09bb078844df40758a5d0f9a27"), "GUSD PriceFeedExt.initialize")
    // info = await PriceFeedExt_wbtc.latestAnswer()
    // console.log("WBTC price", info.price.toString())

    // const PriceFeedExt_ETH = await deployContract("PriceFeedExt", ["WETH Price", "8"])

    // await sendTxn(PriceFeedExt_ETH.initialize(
    //     false,
    //     false,
    //     PriceFeedExt_pls.address,
    //     "0x02dcdd04e3f455d838cd1249292c58f3b79e3c3c",
    //     "0x42abdfdb63f3282033c766e72cc4810738571609",
    //     "0xa1077a294dde1b09bb078844df40758a5d0f9a27"), "WETH PriceFeedExt.initialize")
    // info = await PriceFeedExt_ETH.latestAnswer()
    // console.log("WETH price", info.price.toString())

    // const PriceFeedExt_PLSX = await deployContract("PriceFeedExt", ["PLSX Price", "8"])

    // await sendTxn(PriceFeedExt_PLSX.initialize(
    //     false,
    //     false,
    //     PriceFeedExt_pls.address,
    //     "0x95b303987a60c71504d99aa1b13b4da07b0790ab",
    //     "0x1b45b9148791d3a104184cd5dfe5ce57193a3ee9",
    //     "0xa1077a294dde1b09bb078844df40758a5d0f9a27"), "PLSX PriceFeedExt.initialize")
    // info = await PriceFeedExt_PLSX.latestAnswer()
    // console.log("PLSX price", info.price.toString())

    // const PriceFeedExt_INC = await deployContract("PriceFeedExt", ["INC Price", "8"])

    // await sendTxn(PriceFeedExt_INC.initialize(
    //     false,
    //     false,
    //     PriceFeedExt_pls.address,
    //     "0x2fa878ab3f87cc1c9737fc071108f904c0b0c95d",
    //     "0xf808bb6265e9ca27002c0a04562bf50d4fe37eaa",
    //     "0xa1077a294dde1b09bb078844df40758a5d0f9a27"), "INC PriceFeedExt.initialize")
    // info = await PriceFeedExt_INC.latestAnswer()
    // console.log("INC price", info.price.toString())

    const PriceFeedExt_HEX = await deployContract("PriceFeedExt", ["HEX Price", "8"])

    await sendTxn(PriceFeedExt_HEX.initialize(
        false,
        false,
        PriceFeedExt_pls.address,
        "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
        "0xf1f4ee610b2babb05c635f726ef8b0c568c8dc65",
        "0xa1077a294dde1b09bb078844df40758a5d0f9a27"), "HEX PriceFeedExt.initialize")
    info = await PriceFeedExt_HEX.latestAnswer()
    console.log("HEX price", info.price.toString())

    // const PriceFeedExt_USDT = await deployContract("PriceFeedExt", ["USDT Price", "8"])
    const PriceFeedExt_USDT = await contractAt("PriceFeedExt", "0x00f8e3121C4bE94d015D01d56fFD2F8996e34A1C")

    // await sendTxn(PriceFeedExt_USDT.initialize(
    //     true,
    //     false,
    //     PriceFeedExt_pls.address,
    //     "0x0cb6f5a34ad42ec934882a05265a7d5f59b51a2f",
    //     "0x322df7921f28f1146cdf62afdac0d6bc0ab80711",
    //     "0x0cb6f5a34ad42ec934882a05265a7d5f59b51a2f"), "USDT PriceFeedExt.initialize")
    info = await PriceFeedExt_USDT.latestAnswer()
    console.log("USDT price", info.price.toString())

    // const PriceFeedExt_USDC = await deployContract("PriceFeedExt", ["USDC Price", "8"])

    // await sendTxn(PriceFeedExt_USDC.initialize(
    //     true,
    //     false,
    //     PriceFeedExt_pls.address,
    //     "0x15d38573d2feeb82e7ad5187ab8c1d52810b1f07",
    //     "0x6753560538eca67617a9ce605178f788be7e524e",
    //     "0x15d38573d2feeb82e7ad5187ab8c1d52810b1f07"), "USDC PriceFeedExt.initialize")
    // info = await PriceFeedExt_USDC.latestAnswer()
    // console.log("USDC price", info.price.toString())


    // const PriceFeedExt_DAI = await deployContract("PriceFeedExt", ["DAI Price", "8"])

    // await sendTxn(PriceFeedExt_DAI.initialize(
    //     true,
    //     false,
    //     PriceFeedExt_pls.address,
    //     "0xefd766ccb38eaf1dfd701853bfce31359239f305",
    //     "0xe56043671df55de5cdf8459710433c10324de0ae",
    //     "0xefd766ccb38eaf1dfd701853bfce31359239f305"), "DAI PriceFeedExt.initialize")
    // info = await PriceFeedExt_DAI.latestAnswer()
    // console.log("DAI price", info.price.toString())    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });