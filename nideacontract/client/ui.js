const productForm = document.querySelector('#productForm')

document.addEventListener('DOMContentLoaded', () => {
    App.init()
})

productForm.addEventListener('submit', (e) => {
    e.preventDefault()

    App.createProduct(productForm["name"].value, productForm["description"].value, productForm["code"].value);
});