// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../tokens/MintableBaseToken.sol";

contract GPLP is MintableBaseToken {
    constructor() MintableBaseToken("Gplp", "GPLP", 0) {
    }

    function id() external pure returns (string memory _name) {
        return "Gplp";
    }
}
