const { expect, assert } = require("chai");
const {ethers} = require("hardhat");

describe("Blits Estates Unit Test Cases", function () {

    it("Test to check deployment of contracts", async function () {

        const [owner, addr1, addr2, addr3, addr4, treasury] = await ethers.getSigners();

        console.log("Active Address:" + owner.address);

        //  USDC Contract Launch
        const USDC = await ethers.getContractFactory("BlitsToken");
        const usdcContract = await USDC.deploy(treasury.address);
        await usdcContract.deployed();
                console.log("USDC Address:" + usdcContract.address);

        await usdcContract.changeFeeStatus(true, 500, "0x0000000000000000000000000000000000000000");

        let usdcTx = await usdcContract.mint(addr2.address, ethers.utils.parseUnits("1.2","ether"));
        await usdcTx.wait();

        let usdcTx2 = await usdcContract.mint(addr4.address, ethers.utils.parseUnits("1000","ether"));
        await usdcTx2.wait();

        await usdcContract.connect(addr4).transfer(addr3.address, ethers.utils.parseUnits("1000","ether"));

        console.log("addr 4 balance : ",await usdcContract.balanceOf(addr4.address));
        console.log("addr 3 balance : ",await usdcContract.balanceOf(addr3.address));
        console.log("treasury balance : ",await usdcContract.balanceOf(treasury.address));

        // Factory Contract launch
        const Clone = await ethers.getContractFactory("FactoryCloneContract");
        const factoryContract = await Clone.deploy(usdcContract.address);
        await factoryContract.deployed();

        console.log("Active Address:" + addr1.address);

        console.log("Factory address:" + factoryContract.address);

        const setTx = await factoryContract.connect(owner).createDAO(
                "token1",
                "TK1",    
                10000,   // total investment = 10000 * 0.1 = 1000 ether
                ethers.utils.parseUnits("0.1","ether")
                );
                console.log("DAO_Created");

       var share_address = await factoryContract.sharesContractArray(1);
       console.log("Share_address", share_address);

       let shareContract = await ethers.getContractAt("Shares", share_address); 

       var usdc2Tx = await usdcContract.connect(addr2).approve(share_address, ethers.utils.parseUnits("1.2","ether"));     
       console.log("Approve blits");
       
       await shareContract.connect(addr2).buyShares(12);

       await shareContract.burnToken(addr2.address, 2);
       console.log("balance share of addr2 : ",        await shareContract.balanceOf(addr2.address));
       await shareContract.changePrice(ethers.utils.parseUnits("0.01","ether"));

       var usdc2Tx = await usdcContract.connect(addr3).approve(share_address, ethers.utils.parseUnits("988","ether"));     
       console.log("Approve blits");
       
       await shareContract.connect(addr3).buyShares(9880);

       console.log("balance share of addr3 : ",        await shareContract.balanceOf(addr3.address));

       return;



       var usdc2Tx = await usdcContract.connect(addr3).approve(governor_address, ethers.utils.parseUnits("24","ether"));
       await usdc2Tx.wait(); 
       var shares_count = ethers.utils.parseUnits("24","ether") / ethers.utils.parseUnits("0.1","ether");

       await GovernorProxy.connect(addr1).buyShares(addr3.address, shares_count, ethers.utils.parseUnits("24","ether"));
       expect(await usdcContract.balanceOf(addr3.address)).to.equal(0);
       expect(await usdcContract.balanceOf(treasury.address)).to.equal(ethers.utils.parseUnits("36","ether"));

       var usdc2Tx = await usdcContract.connect(addr4).approve(governor_address, ethers.utils.parseUnits("6","ether"));
       await usdc2Tx.wait(); 
       var shares_count = ethers.utils.parseUnits("6","ether") / ethers.utils.parseUnits("0.1","ether");

       await GovernorProxy.connect(addr1).buyShares(addr4.address, shares_count, ethers.utils.parseUnits("6","ether"));
       expect(await usdcContract.balanceOf(addr4.address)).to.equal(0);
       expect(await usdcContract.balanceOf(treasury.address)).to.equal(ethers.utils.parseUnits("42","ether"));


       console.log("Calculate Voting Power of members");
       let supply = await TokenProxy.totalSupply();
       expect(await TokenProxy.getVotes(addr2.address)).to.equal(ethers.utils.parseUnits("120","ether"));
       console.log("Voting power of address_2 = % ", await TokenProxy.getVotes(addr2.address) / supply );

       expect(await TokenProxy.getVotes(addr3.address)).to.equal(ethers.utils.parseUnits("240","ether"));
       console.log("Voting power of address_3 = % ", await TokenProxy.getVotes(addr3.address) / supply );

       expect(await TokenProxy.getVotes(addr4.address)).to.equal(ethers.utils.parseUnits("60","ether"));
       console.log("Voting power of address_4 = % ", await TokenProxy.getVotes(addr4.address) / supply );

       console.log(" Proposal tests Starts Here ");
       console.log(" ");
       console.log(" ");

       await GovernorProxy.connect(addr1).createProposal({
           proposalHash: "jbhj23bj2h3b2jh3bjh32j3bh",
           status: 0,
           proposalId: 0,
           options: [0,0,0,0],
           quorum: 10,
           threshold: 10,
           day: 10});   

        console.log("Creating a Proposal ; ",await GovernorProxy.getProposal(0));

        await GovernorProxy.connect(addr1).submitProposal(0,[0,1,0,0]);   
    
        console.log(" Submitting a Proposal : ",await GovernorProxy.getProposal(0));

        return;
     
    });
});
 




   
