// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../tokens/MintableBaseToken.sol";

contract GPLX is MintableBaseToken {
    constructor() MintableBaseToken("Gplx", "GPLX", 0) {
    }

    function id() external pure returns (string memory _name) {
        return "Gplx";
    }
}
