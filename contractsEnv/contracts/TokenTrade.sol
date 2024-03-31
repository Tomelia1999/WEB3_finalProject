// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract TokenTrade {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function tradeTokens(
        address tokenAddress,
        address seller,
        address buyer,
        uint256 tokenAmount,
        uint256 paymentAmount
    ) external payable {
        require(msg.sender == buyer, "Only the buyer can initiate the trade.");
        require(msg.value == paymentAmount, "Payment amount must match.");

        IERC20 token = IERC20(tokenAddress);

        uint256 allowedAmount = token.allowance(seller, address(this));
        require(allowedAmount >= tokenAmount, "Not enough tokens approved for trade.");

        bool tokenTransferSuccess = token.transferFrom(seller, buyer, tokenAmount);
        require(tokenTransferSuccess, "Token transfer failed.");

        (bool paymentSuccess,) = payable(seller).call{value: paymentAmount}("");
        require(paymentSuccess, "Payment to seller failed.");
    }

    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw.");
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}
}
