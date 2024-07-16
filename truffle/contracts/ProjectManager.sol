// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./Project.sol";

contract ProjectManager {
    mapping(uint256 => address) public projects;
    uint256 public projectNumber = 1;
    uint minGoal = 1000000 * 1 gwei;
    uint day = 86400;

    function createProject(
        address receiverAddress,
        string memory projectName,
        string memory projectDescription,
        uint256 projectGoal,
        uint256 fundingDuration,
        uint refundDuration
    ) external {
        require(projectGoal * 1 gwei  >= minGoal, "Project goal should be atleast 0.001 Eth");
        require(fundingDuration >= 432000 , "Funding duration must be atleast 5 Days.");
        require(refundDuration >= 86400, "Refund Duration must be atleast 1 Day.");

        Project newProject = new Project(
            msg.sender,
            receiverAddress,
            projectName,
            projectDescription,
            projectGoal * 1 gwei,
            fundingDuration,
            refundDuration
        );
        projects[projectNumber] = address(newProject);
        projectNumber++;
    }
}
