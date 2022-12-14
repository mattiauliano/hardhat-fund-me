// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// Importing library
import "./PriceConverter.sol";

// Creating a costum error
error NotOwner();

contract FundMe {
    // Specify the usage for PriceConverter | library --> uint256
    using PriceConverter for uint256;
    // Who deploy the contract
    address public immutable i_owner;

    AggregatorV3Interface public priceFeed;

    // A function that runs whenever the contract gets deployed
    // Parameterize priceFeedAddress
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    uint256 public constant MINIMUM_USD = 10 * 1e18;
    // Funders dynamic list
    address[] public funders;
    // Associate address and funds
    mapping(address => uint256) public AddressToAmountFunds;

    function fund() public payable {
        // Gets funds from users
        // Set a minimum funding value in USD
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "Send at least 10$!"
        );
        // Add sender's address
        funders.push(msg.sender);
        // Adding funds to actually sender
        AddressToAmountFunds[msg.sender] += msg.value;
    }

    function withdraw() public OnlyOwner {
        // Reset all addresses funds with a for loop
        for (uint256 index = 0; index < funders.length; index++) {
            address funder = funders[index];
            AddressToAmountFunds[funder] = 0;
        }

        // Reset funders array
        funders = new address[](0);

        // Withdraw
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed!");
        // Call returns two things, we have no interest in data in this case. Leave a comma.
    }

    // Modifier to add permission at contract's owner
    modifier OnlyOwner() {
        // This is an example of custom error to save gas
        if (i_owner != msg.sender) {
            revert NotOwner();
        }
        _; // All the function code will execute after the require
    }

    // Receive external payments
    receive() external payable {
        fund();
    }

    // Calls a function that doesn't exist
    fallback() external payable {
        fund();
    }
}
