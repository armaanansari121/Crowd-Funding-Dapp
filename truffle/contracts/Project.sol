// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Project {
    enum State {
        paymentPending,
        closed
    }

    struct Donation {
        uint256 value;
        string message;
    }

    address public creator;
    address public receiver;
    string public name;
    string public description;
    uint256 public goal;
    uint256 public raised;
    uint256 public fundingDeadline;
    uint256 public refundDeadline;
    State public state;

    uint256 minDonation = 1000000 * 1 gwei;
    uint256 refundFee = 10000000 * 1 wei;

    mapping(address => Donation) public donations;

    constructor(
        address _creator,
        address _receiver,
        string memory _name,
        string memory _description,
        uint256 _goal,
        uint256 _fundingDeadline,
        uint256 _refundDeadline
    ) {
        creator = _creator;
        receiver = _receiver;
        name = _name;
        description = _description;
        goal = _goal;
        raised = 0;
        fundingDeadline = _fundingDeadline;
        refundDeadline = _refundDeadline;
        state = State.paymentPending;
    }

    function donateToProject(string memory message) external payable {
        require(state == State.paymentPending, "Project Closed.");
        require(block.timestamp <= fundingDeadline, "Fundng Period is over.");
        require(msg.value >= minDonation, "Amount less than minimum donation.");

        Donation storage donation = donations[msg.sender];
        donation.value += msg.value;
        donation.message = message;

        raised += msg.value;
        if (raised >= goal) {
            uint256 excess = raised - goal;
            if (excess > refundFee) {
                payable(msg.sender).transfer(excess - refundFee);
                donation.value -= excess;
            }
            raised = goal;
            payable(receiver).transfer(address(this).balance);
            state = State.closed;
        }
    }

    function refund(uint256 amount) external payable {
        uint256 toPay = amount * 1 gwei;
        Donation storage donation = donations[msg.sender];
        require(state == State.paymentPending, "Project Closed.");
        require(
            block.timestamp >= fundingDeadline,
            "Refund period has not started."
        );
        require(refundDeadline >= block.timestamp, "Refund period over.");
        require(
            donation.value >= toPay,
            "Asking amount is greater than donated."
        );
        payable(msg.sender).transfer(toPay - refundFee);
        donation.value -= toPay;
        raised -= toPay;
    }

    function makePayment() external payable {
        require(state == State.paymentPending, "Payment has already been made.");
        require(donations[msg.sender].value > 0, "You are not a participant of this fund.");
        require(block.timestamp >= refundDeadline, "Project is still running.");
        payable(receiver).transfer(address(this).balance);
        state = State.closed;
    }
}
