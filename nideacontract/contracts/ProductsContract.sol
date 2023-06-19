// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ProductsContract {
    uint public productCounter = 0;

    constructor () {
        createProduct("primer producto", "ejemplo test", "ABC666");
    }

    event ProductCreated(
        uint id,
        string name,
        string description,
        string code,
        bool selled,
        uint256 registeredAt,
        uint256 modifiedAt
    );

    event productToggleDone (uint id, bool selled, uint256 modifiedAt);

    struct Product{
        uint256 id;
        string name;
        string description;
        string code;
        bool selled;
        uint256 registeredAt; 
        uint256 modifiedAt;
    }

    mapping (uint256 => Product) public products;

    function createProduct(string memory _name, string memory _description, string memory _code) public {
        products[productCounter] = Product(productCounter, _name, _description, _code, false, block.timestamp, block.timestamp);
        productCounter++;
        emit ProductCreated(productCounter, _name, _description, _code, false, block.timestamp, block.timestamp);
    }

    function toggleSelled(uint _id) public {
        Product memory _product = products[_id];
        _product.modifiedAt = block.timestamp;
        _product.selled = !_product.selled;
        products[_id] = _product;
        emit productToggleDone(_id, _product.selled, _product.modifiedAt);
    }

}