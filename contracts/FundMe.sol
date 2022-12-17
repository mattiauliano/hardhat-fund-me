// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// Importing library
import "./PriceConverter.sol";

// Creating costum errors
error FundMe__NotOwner();
error FundMe__CallFail();
error FundMe__NotEnoughMoney();

/// @title A contract for crowd funding
/// @author Mattia Uliano
/// @notice This contract is to demo a sample funding contract
/// @dev This implements price feeds as our library

contract FundMe {
    // Specify the usage for PriceConverter | library --> uint256
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 10 * 1e18;
    // Who deploy the contract
    address private immutable i_owner;
    // Funders dynamic list
    address[] private s_funders;
    // Associate address and funds
    mapping(address => uint256) private s_addressToAmountFunds;
    // It will be specified in the constructor
    AggregatorV3Interface private s_priceFeed;

    // Modifier to add permission at contract's owner
    modifier OnlyOwner() {
        // This is an example of custom error to save gas
        if (i_owner != msg.sender) {
            revert FundMe__NotOwner();
        }
        _; // All the function code will execute after the require
    }

    // A function that runs whenever the contract gets deployed
    // Parameterize priceFeedAddress
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        // abi(address)
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // Receive external payments
    receive() external payable {
        fund();
    }

    // Calls a function that doesn't exist
    fallback() external payable {
        fund();
    }

    function fund() public payable {
        // Gets funds from users
        // Set a minimum funding value in USD
        if (msg.value.getConversionRate(s_priceFeed) < MINIMUM_USD) {
            revert FundMe__NotEnoughMoney();
        }
        // Add sender's address
        s_funders.push(msg.sender);
        // Adding funds to actually sender
        s_addressToAmountFunds[msg.sender] += msg.value;
    }

    function withdraw() public OnlyOwner {
        // Reset all addresses funds with a for loop
        // Assign to a memory variable s_funders to avoid read from storage (a lot of gas)
        address[] memory funders = s_funders;
        for (uint256 index = 0; index < funders.length; index++) {
            address funder = funders[index];
            s_addressToAmountFunds[funder] = 0;
        }

        // Reset funders array
        s_funders = new address[](0);

        // Withdraw
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        // Call returns two things, we have no interest in data in this case. Leave a comma.

        if (!callSuccess) {
            revert FundMe__CallFail();
        }
    }

    // Get private variables
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunds[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
