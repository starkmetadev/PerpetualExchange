// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IGplxMigrator {
    function iouTokens(address _token) external view returns (address);
}
