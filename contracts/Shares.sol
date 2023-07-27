// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Shares Token Contract
contract Shares is Initializable, ERC20Upgradeable {

        address public Factory;
        address public Owner;
        address public Blitz;
        uint256 public maxSupply;
        uint256 public pricePerShare;
      
        /// @dev isFactory modifier to allow only Factory contract access to Token Contract functions    
        modifier isFactory () {
        require(msg.sender == Factory, "Not authorized");
                _;
        }

        modifier isOwner () {
        require(msg.sender == Owner, "Not authorized");
                _;
        }

        /// @dev initialize Function to initialize Shares contract
        /// @param name reflect the name of Governance Token
        /// @param symbol reflect the symbol of Governance Token
        function initialize(string calldata name, string calldata symbol, uint256 _maxSupply, address _Factory, address _owner, address _blits, uint256 _price) initializer public {
                __ERC20_init(name, symbol);
                maxSupply = _maxSupply;
                Factory = _Factory;
                Owner = _owner;
                pricePerShare = _price;
                Blitz = _blits;
        }

        /// @dev Function to change max supply
        function changeMaxSupply(uint256 _maxSupply) public isOwner{
            maxSupply = _maxSupply;
        }

        function changeOwner(address _owner) public isOwner{
                Owner = _owner;
        }

         function changeBlitz(address _blitz) public isOwner{
                Blitz = _blitz;
        }

        function changePrice(uint256 _price) public isOwner{
                pricePerShare = _price;
        }

        // The following functions are overrides required by Solidity.

        function _afterTokenTransfer(address from, address to, uint256 amount)
                internal
                override(ERC20Upgradeable)
        {
        super._afterTokenTransfer(from, to, amount);
        }

        function _mint(address to, uint256 amount)
                internal
                override(ERC20Upgradeable)
        {
        super._mint(to, amount);
        }

        function _burn(address account, uint256 amount)
                internal
                override(ERC20Upgradeable)
        {
        super._burn(account, amount);
        }

        /// @dev Function to mint Governance Token and assign delegate
        /// @param amount Value of tokens to be minted based on deposit by DAO member
        function buyShares(uint256 amount) external {
        require(totalSupply() + amount <= maxSupply,"Max Supply reached");
        IERC20(Blitz).transferFrom(msg.sender, Owner, amount * pricePerShare);  
        _mint(msg.sender, amount);
        }

        /// @dev Function to burn Governance Token 
        /// @param account Address from where token will be burned
        /// @param amount Value of tokens to be burned   
        function burnToken(address account, uint256 amount) external isOwner {
        _burn(account, amount);
        }
        
        }
