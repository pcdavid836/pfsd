const ProductsContract = artifacts.require("ProductsContract")

contract("ProductsContract", () => {

    before(async () => {
        this.productsContract = await ProductsContract.deployed()
    })

    it('migrate deployed successfully', async () => {
        const address = this.productsContract.address

        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");

    })

    it('get Products List', async () => {
        const productCounter = await this.productsContract.productCounter();
        const product = await this.productsContract.products(productCounter);

        assert.equal(product.id.toNumber(), productCounter);
        assert.equal(product.name, "primer producto");
        assert.equal(product.description, "ejemplo test");
        assert.equal(product.code, "ABC666");
        assert.equal(product.selled, false);
        assert.equal(productCounter, 1);

    });

    it("product created successfully", async () => {
        const result = await this.productsContract.createProduct("some name", "description two", "code example");
        const productEvent = result.logs[0].args;
        const productCounter = await this.productsContract.productCounter();

        assert.equal(productCounter, 2);
        assert.equal(productEvent.id.toNumber(), 2);
        assert.equal(productEvent.name, "some name");
        assert.equal(productEvent.description, "description two");
        assert.equal(productEvent.code, "code example");
        assert.equal(productEvent.selled, false);


    })

    it('product toggle done', async() => {
        const result = await this.productsContract.toggleSelled(1);
        const productEvent = result.logs[0].args;
        const product = await this.productsContract.products(1);

        assert.equal(product.done, true);
        assert.equal(productEvent.done, true);
        assert.equal(productEvent.id, 1);
    });

});