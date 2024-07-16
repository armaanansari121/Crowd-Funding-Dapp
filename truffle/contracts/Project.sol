// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Project {
    enum State {
        fundingPeriod,
        refundPeriod,
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
    uint256 fundingDuration;
    uint256 refundDuration;
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
        uint256 _fundingDuration,
        uint256 _refundDuration
    ) {
        creator = _creator;
        receiver = _receiver;
        name = _name;
        description = _description;
        goal = _goal;
        raised = 0;
        fundingDuration = _fundingDuration;
        fundingDeadline = block.timestamp + _fundingDuration;
        refundDuration = _refundDuration;
        state = State.fundingPeriod;
    }

    function donateToProject(string memory message) external payable {
        require(
            state == State.fundingPeriod,
            "Funding Period is over."
        );
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
            state = State.paymentPending;
        }
    }

    function targetNotHit() external {
        require(
            msg.sender == creator,
            "You do not have authority to close funding."
        );
        require(state == State.fundingPeriod, "Project has completed funding period.");
        require(raised <= goal, "Target has been hit.");
        require(block.timestamp >= fundingDeadline, "Funding Deadline not Reached.");

        state = State.refundPeriod;
        refundDeadline = block.timestamp + refundDuration;
    }

    function refund(uint256 amount) external payable {
        uint256 toPay = amount * 1 gwei;
        Donation storage donation = donations[msg.sender];
        require(
            state == State.refundPeriod,
            "Project is not in refund period."
        );
        require(
            refundDeadline >= block.timestamp,
            "Refund period over."
        );
        require(
            donation.value >= toPay,
            "Asking amount is greater than donated."
        );
        payable(msg.sender).transfer(toPay - refundFee);
        donation.value -= toPay;
        raised -= toPay;
    }

    function refundPeriodOver() external {
        require(
            msg.sender == creator,
            "You do not have the authority to finish refund period."
        );
        require(
            state == State.refundPeriod,
            "Refund period is not going on."
        );
        require(
            refundDeadline <= block.timestamp,
            "Refund period is not over."
        );
        state = State.paymentPending;
    }

    function makePayment() external payable {
        require(
            state == State.paymentPending,
            "Project is still running."
        );
        require(
            msg.sender == creator,
            "You do not have the authority to make payment."
        );
        payable(receiver).transfer(address(this).balance);
        state = State.closed;
    }
}
