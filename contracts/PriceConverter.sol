// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// Importing from GitHub Chainlink interface to get price from an api
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice() internal view returns (uint256) {
        // Address and ABI needed to interact with Chainlink Smart Contract
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );
        // Get price of ETH in USD
        (, int256 price, , , ) = priceFeed.latestRoundData();
        // 1000.00000000

        // Moltiplicating to get the same decimals number
        // Decimals must be equal msg.value has 18 decimals, price 8 decimals
        return uint256(price * 1e10);
        // Converting the same type of msg.value --> uint256(int number)
    }

    function getConversionRate(
        uint256 ethAmount
    ) internal view returns (uint256) {
        // Convert msg.value from ETH in USD
        uint256 ethPrice = getPrice();
        // 3000_000000000000000000 = ETH / USD price
        // 1_000000000000000000 ETH

        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}
