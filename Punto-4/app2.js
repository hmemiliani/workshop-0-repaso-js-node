document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://fakestoreapi.com/products';
    const productsContainer = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');


    let allProducts = [];


    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            const products = await response.json();
            allProducts = products; 
            displayProducts(products);
            populateCategories(products);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            productsContainer.innerHTML = '<p>Error al cargar productos.</p>';
        }
    };

    // Función para mostrar productos en la página
    const displayProducts = (products) => {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h2>${product.title}</h2>
                <p>${product.price} USD</p>
            `;
            productsContainer.appendChild(productElement);
        });
    };


    const populateCategories = (products) => {
        const categories = [...new Set(products.map(product => product.category))]; //elimina las categorias repetidas
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });
    };


    const filterProducts = () => {
        const searchValue = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        let filteredProducts = allProducts;

        if (searchValue) {
            filteredProducts = filteredProducts.filter(product => 
                product.title.toLowerCase().includes(searchValue)
            );
        }

        if (selectedCategory) {
            filteredProducts = filteredProducts.filter(product => 
                product.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        displayProducts(filteredProducts);
    };


    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);


    fetchProducts();
});
