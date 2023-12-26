// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../tokens/MintableBaseToken.sol";

contract EsGPLX is MintableBaseToken {
    constructor() MintableBaseToken("Escrowed GPLX", "esGPLX", 0) {
    }

    function id() external pure returns (string memory _name) {
        return "esGPLX";
    }
}
