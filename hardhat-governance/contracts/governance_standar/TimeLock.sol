// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/governance/TimelockController.sol";


contract TimeLock is TimelockController {
    constructor(
     uint256 minDelay, // How many blocks to wait before executing
    address[]memory proposers, //  is the list of addresses that can propose
    address[]memory executors // who can execute when a proposle is approved
    )
    TimelockController(minDelay,proposers,executors)
    {

    }
}