// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AccessToken is ERC20, Ownable {
    // Constructor'a initialOwner parametresi eklendi
    constructor(address initialOwner) 
        ERC20("AccessToken", "ACC")
        Ownable(initialOwner)
    {
        _mint(initialOwner, 1000000 * 10**18);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}