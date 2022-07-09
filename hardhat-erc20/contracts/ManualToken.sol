// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



contract ManualToken{ 
    mapping(address => uint256) public balanceOf;
    mapping(address=>mapping(address=>uint256)) allowance;

    function transfer(
        address from,
        address to,
        uint256 amount
    )public  {
        balanceOf[from] -= amount;
        balanceOf[to]+=amount;
    }

     function transferFrom(address _from,address _to,uint256 _value) public returns(bool success)
     {
        require(_value<=allowance[_from][msg.sender]);
        allowance[_from][msg.sender]-=_value;
        transfer(_from,_to,_value);
        success= true;
     }

     function getBalance(address account) public view returns (uint256){
        return balanceOf[account];
    }
}