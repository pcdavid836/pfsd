
App = {
    contracts: [],
    init: async () => {
        console.log('Loaded');
        await App.loadEthereum();
        await App.loadAccounts();
        await App.loadContracts();
        App.render();
        await App.renderProducts();
    },

    loadEthereum: async () => {
        
        if (window.ethereum) {
            App.web3Provider = window.ethereum
            await window.ethereum.request({method: 'eth_requestAccounts'})
        } else if (window.web3){
            web3 = new Web3(window.web3.currentProvider)
        } 
        
        else {
            console.log('No hay alguna extension ethereum instalada, Intenta Instalando Metamask')
        }
    },

    loadAccounts: async () => {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        App.account = accounts[0]
    },

    loadContracts: async () => {
        const res = await fetch("ProductsContract.json")
        const productsContractJSON = await res.json()

        App.contracts.productsContract = TruffleContract(productsContractJSON)
        
        App.contracts.productsContract.setProvider(App.web3Provider)

        App.productsContract = await App.contracts.productsContract.deployed()
    },

    render: () => {
        document.getElementById('account').innerText = App.account
    },

    renderProducts: async () => {
        const productCounter = await App.productsContract.productCounter()
        const productCounterNumber = productCounter.toNumber()

        let html = ''
        
        for (let i = 1; i <= productCounterNumber; i++) {
            const product = await App.productsContract.products(i)

            const productId = product[0]
            const productName = product[1]
            const productDescription = product[2]
            const productCode = product[3]
            const productSelled = product[4]
            const productCreated = product[5]
            const productModified = product[6]

            let productElement = `
            <div class="card bg-dark rounded-0 mb-2">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span class="text-white">${productName}</span>
                        <div class="form-check form-switch">
                            <input class="form-check-input" data-id="${productId}" type="checkbox" ${productSelled && "checked"}
                                onchange="App.toggleSelled(this)"
                            />
                        </div>
                    </div>
                    <div class="card-body">
                        <span class="text-white">${productDescription}</span>
                        <div>
                            <span class="text-white">Codigo: ${productCode}</span>
                            <p class="text-white"> Creacion: ${new Date(productCreated * 1000).toLocaleString()}</p>
                            <p class="text-white"> Modificado: ${new Date(productModified * 1000).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

            </div>
            `

            html += productElement;
        }

        document.querySelector('#productsList').innerHTML = html;

    },

    createProduct: async (name, description, code) => {
        const result = await App.productsContract.createProduct(name, description, code, {
            from: App.account
        })
        console.log(result.logs[0].args)
        window.location.reload();
    },

    toggleSelled: async (element) => {
        const productId = element.dataset.id;
        await App.productsContract.toggleSelled(productId, {
          from: App.account,
        });
        window.location.reload();
      },

}
