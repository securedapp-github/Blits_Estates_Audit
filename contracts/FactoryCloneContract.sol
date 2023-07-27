// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Shares.sol";

/// @title Blitz Cloning Contract
/// @dev Contract create proxies of Shares contract
contract FactoryCloneContract {
    uint256 public counter;
    address public SharesAddress;
    address public owner;
    address public blits;

    mapping(uint256 => address) public sharesContractArray;
    mapping(address => uint256[]) public clientArray;

    event PublishProperty(address indexed, address indexed);

    /// @dev Initial Deployment of Shares contract and storing their addresses for proxies creation
    constructor(address _blitsToken) {
        SharesAddress = address(new Shares());
        owner = msg.sender;
        blits = _blitsToken;
    }

    /// @dev Modifier to check for Owner of contract
    modifier isOrganiser() {
        require(msg.sender == owner, "Only Owner Allowed");
        _;
    }

    /// @dev Function to assign new Owner
    /// @param _newOrganiser address of new owner
    function changeOrganiser(address _newOrganiser) external isOrganiser {
        if (_newOrganiser != address(0)) {
            owner = _newOrganiser;
        }
    }

    function changeBlitsTokenOrShare(address _token, address _share) external isOrganiser {
            if(_token != address(0)) blits = _token;
            if(_share != address(0)) SharesAddress = _share;
    }

    function createDAO(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 _shares,
        uint256 _price    // In Wei
    ) external isOrganiser{
        address tokenAddress;
        tokenAddress = Clones.clone(SharesAddress);
        Shares(tokenAddress).initialize(tokenName, tokenSymbol, _shares, address(this), msg.sender, blits, _price);

        counter++;
        sharesContractArray[counter] = tokenAddress;
        clientArray[msg.sender].push(counter);
        emit PublishProperty(msg.sender, tokenAddress);

    }
}
