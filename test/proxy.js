
const { ethers } = require ("hardhat");
const { expect } = require ("chai");
const { upgrades } = require ("hardhat");

describe("Upgradeable Contract", function () {
  let first;
  let second;
  let third;
  let fourth;

  /*beforeEach(async function () {
    const First = await ethers.getContractFactory("First");
    first = await upgrades.deployProxy(First, []);
    await first.deployed();
  });*/

  it("should have the correct initial implementation", async function () {
    const First = await ethers.getContractFactory("First");
    first = await upgrades.deployProxy(First, { initializer: 'initialize' });
    expect(await first.retrieve()).to.equal(0);
  });

  it("should upgrade to the second version", async function () {
    const FirstV2 = await ethers.getContractFactory("FirstV2");
    second = await upgrades.upgradeProxy(first.address, FirstV2);
    await second.deployed();

    expect(await second.retrieve()).to.equal(0);

    await second.increment();
    expect(await second.retrieve()).to.equal(1);
  });

  it("should upgrade to the third version", async function () {
    const FirstV3 = await ethers.getContractFactory("FirstV3");
    third = await upgrades.upgradeProxy(first.address, FirstV3);
    await third.deployed();

    expect(await third.retrieve()).to.equal(1);

    await third.increment();
    expect(await third.retrieve()).to.equal(2);
    expect(await third.name()).to.equal("FirstV3");
  });

  it("should upgrade to the fourth version", async function () {
    const FirstV4 = await ethers.getContractFactory("FirstV4");
    fourth = await upgrades.upgradeProxy(first.address, FirstV4);
    await fourth.deployed();

    expect(await fourth.retrieve()).to.equal(2);

    await fourth.increment();
    expect(await fourth.retrieve()).to.equal(3);
    expect(await fourth.name()).to.equal("FirstV4");
  });
});
