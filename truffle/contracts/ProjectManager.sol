// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./Project.sol";

contract ProjectManager {
    mapping(uint256 => address) public projects;
    uint256 public projectNumber = 1;
    uint256 minGoal = 1000000 * 1 gwei;
    uint256 day = 86400;

    function createProject(
        address receiverAddress,
        string memory projectName,
        string memory projectDescription,
        uint256 projectGoal,
        uint256 fundingDeadline,
        uint256 refundDeadline
    ) external {
        require(
            projectGoal * 1 gwei >= minGoal,
            "Project goal should be atleast 0.001 Eth"
        );
        require(
            fundingDeadline - block.timestamp >= 432000,
            "Funding duration must be atleast 5 Days."
        );
        require(
            refundDeadline - fundingDeadline >= 86400,
            "Refund Duration must be atleast 1 Day."
        );

        Project newProject = new Project(
            msg.sender,
            receiverAddress,
            projectName,
            projectDescription,
            projectGoal * 1 gwei,
            fundingDeadline,
            refundDeadline
        );
        projects[projectNumber] = address(newProject);
        projectNumber++;
    }
}
