// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function decimals() external view returns (uint8);
    function balanceOf(address account) external view returns (uint256);
}

struct PriceInfo {
    uint256 price;
    uint256 conf;
}

interface IPriceFeedUSDT {
    function latestAnswer() external view returns (PriceInfo memory priceInfo);
}

contract PriceFeedExt {
    address public gov;

    uint8 public decimals = 8;
    string public description;

    bool public isStableCoin = false;
    bool public isUSDTPair = false;
    address public token1Address;
    address public pairAddress;
    address public token2Address;
    address public usdtPairAddress;

    modifier onlyGov() {
        require(msg.sender == gov, "Not Governor");
        _;
    }

    constructor(string memory _description, uint8 _decimals) {
        gov = msg.sender;
        description = _description;
        decimals = _decimals;
    }

    function initialize(
        bool _isStableCoin,
        bool _isUSDTpair,
        address _usdtPair,
        address _token1,
        address _pair,
        address _token2
    ) external onlyGov {
        isStableCoin = _isStableCoin;
        isUSDTPair = _isUSDTpair;
        usdtPairAddress = _usdtPair;
        token1Address = _token1;
        pairAddress = _pair;
        token2Address = _token2;
    }

    function latestAnswer() external view returns (PriceInfo memory priceInfo) {
        if (isStableCoin) {
            priceInfo.price = 1 * 10 ** decimals;
            priceInfo.conf = priceInfo.price / 5000;
            return priceInfo;
        }

        uint256 token1Amount = IERC20(token1Address).balanceOf(pairAddress);
        uint8 token1Decimal = IERC20(token1Address).decimals();
        uint256 token2Amount = IERC20(token2Address).balanceOf(pairAddress);
        uint256 token2Decimal = IERC20(token2Address).decimals();

        uint256 price = 0;
        if (isUSDTPair) {
            price = ((token2Amount / (10 ** token2Decimal)) * 1 *
                (10 ** decimals)) / (token1Amount / (10 ** token1Decimal));
        } else {
            PriceInfo memory info = IPriceFeedUSDT(usdtPairAddress).latestAnswer();
            price = ((token2Amount / (10 ** token2Decimal)) * info.price) / (token1Amount / (10 ** token1Decimal));
        }

        priceInfo.price = price;
        priceInfo.conf = price / 5000;
    }

    function setGov(address newGov) external onlyGov {
        require(gov != newGov, "Already Set");
        gov = newGov;
    }

    function setDescription(string calldata newDescription) external onlyGov {
        description = newDescription;
    }

    function setDecimals(uint8 newDecimals) external onlyGov {
        require(decimals != newDecimals, "Already Set");
        decimals = newDecimals;
    }

    function setToken1Address(address _token) external onlyGov {
        token1Address = _token;
    }

    function setPairAddress(address _pair) external onlyGov {
        pairAddress = _pair;
    }

    function setToken2Address(address _token) external onlyGov {
        token2Address = _token;
    }
}
