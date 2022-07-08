// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Import this file to use console.log

// This is the contract that will be used to generate a random number.
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

// This the contract that will be used to automate the winner picking.
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

error Raffle__NotEnoughFunds();
error Raffle__TransferFailed();
error Raffle__NotOpen();
error Raffle__UpkeepNotNeeded(
    uint256 currentBalance,
    uint256 numPlayers,
    uint256 raffleState
);

/**
 * @title Raffle
 * @author Yassine Belkhadem
 * @dev This contract is used to create a raffle.
 *
 */

contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    uint256 private immutable i_entranceFee;

    // Random Number VRF variables
    VRFCoordinatorV2Interface private immutable i_VRFCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    bytes32 private constant KEYHASH =
        0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    uint256 private immutable i_interval;

    address payable private s_recentWinner;
    RaffleState private s_raffleState;
    address payable[] private s_players;
    uint256 private s_lastTimeStamp;

    event RaffleEnter(address indexed player);
    event RequestRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address VRFCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 gasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(VRFCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_gasLane = gasLane;
        i_VRFCoordinator = VRFCoordinatorV2Interface(VRFCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = gasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughFunds();
        }
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__NotOpen();
        }
        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    function checkUpKeepValue() private view returns (bool upkeepValue) {
        bool isOpen = (s_raffleState == RaffleState.OPEN);
        bool timePassed = (block.timestamp - s_lastTimeStamp) > i_interval;
        bool hasPLayers = (s_players.length > 0);
        bool hasFunds = (address(this).balance > 0);
        upkeepValue = isOpen && timePassed && hasPLayers && hasFunds;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        s_recentWinner = s_players[indexOfWinner];
        s_raffleState = RaffleState.OPEN;
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;

        (bool success, ) = s_recentWinner.call{value: address(this).balance}(
            ""
        );
        if (!success) {
            revert Raffle__TransferFailed();
        }
        emit WinnerPicked(s_recentWinner);
    }

    /**
     * @dev function that the ChainLink Keeper can call to get the winner.
     * they look fo rthe upkeepNeeded to return true
     * the following should return true
     * 1. Time interval respected
     * 2. lottery should have at least 1 player and have some ETH
     * 3. Our subscrption is funded with Link
     * 4. Lottery should be in open state
     */

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = checkUpKeepValue();
        return (upkeepNeeded, "0x0");
    }

    function performUpkeep(bytes calldata) external override {
        bool upKeepValue = checkUpKeepValue();
        if (!upKeepValue)
            revert Raffle__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_raffleState)
            );

        s_raffleState = RaffleState.CALCULATING;

        uint256 requestId = i_VRFCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        emit RequestRaffleWinner(requestId);
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getRaffleState() public view returns (RaffleState) {
        return s_raffleState;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }
}
