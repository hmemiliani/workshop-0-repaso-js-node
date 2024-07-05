document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://api.escuelajs.co/api/v1/products';
    const productsContainer = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');


    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            const products = await response.json();
            displayProducts(products);
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            productsContainer.innerHTML = '<p>Error al cargar productos.</p>';
            return [];
        }
    };


    const displayProducts = (products) => {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <img src="${product.images[0]}" alt="${product.title}">
                <h2>${product.title}</h2>
                <p>${product.price} USD</p>
            `;
            productsContainer.appendChild(productElement);
        });
    };


    const fetchCategories = async () => {
        try {
            const response = await fetch('https://api.escuelajs.co/api/v1/categories');
            const categories = await response.json();
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categoryFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Error al obtener categorías:', error);
        }
    };


    const filterProducts = async () => {
        const searchValue = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const products = await fetchProducts();

        let filteredProducts = products;

        if (searchValue) {
            filteredProducts = filteredProducts.filter(product => 
                product.title.toLowerCase().includes(searchValue)
            );
        }

        if (selectedCategory) {
            filteredProducts = filteredProducts.filter(product => 
                product.category.id == selectedCategory
            );
        }

        displayProducts(filteredProducts);
    };


    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);


    fetchProducts();
    fetchCategories();
});
