// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// Importing from GitHub Chainlink interface(abi) (chainlink/contracts package)
// Matched with address gives you the ability to interact with contract
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        // Get price of ETH in USD
        (, int256 price, , , ) = priceFeed.latestRoundData();
        // 1000.00000000

        // Moltiplicating to get the same decimals number
        // Decimals must be equal msg.value has 18 decimals, price 8 decimals
        return uint256(price * 1e10);
        // Converting the same type of msg.value --> uint256(int number)
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        // Convert msg.value from ETH in USD
        uint256 ethPrice = getPrice(priceFeed);
        // 3000_000000000000000000 = ETH / USD price
        // 1_000000000000000000 ETH

        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}
