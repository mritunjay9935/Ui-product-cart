// Define an array to store the selected products in the cart
const cartItems = [];

// Function to fetch and load the custom data
function loadCustomData() {
    fetch('catalogue.json') // Replace 'custom-data.json' with your JSON file path
        .then(response => response.json())
        .then(data => {
            renderProductCards(data);
        })
        .catch(error => {
            console.error('Error loading custom data:', error);
        });
}

// Function to format the price as "Rs XXX"
function formatPrice(price) {
    return `Rs ${new Intl.NumberFormat('en-IN').format(price)}`;
}

// Function to render product cards based on the provided data
function renderProductCards(products) {
    const productList = document.getElementById("product-list");
    const searchInput = document.getElementById("search");
    const genderFilters = document.querySelectorAll('input[name="gender"]');
    const colorFilters = document.querySelectorAll('input[name="color"]');
    const priceFilters = document.querySelectorAll('input[name="price"]');
    const typeFilters = document.querySelectorAll('input[name="type"]');

    function updateProductCards() {
        productList.innerHTML = "";
        const filteredProducts = products.filter(product => {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedGenders = getSelectedValues(genderFilters);
            const selectedColors = getSelectedValues(colorFilters);
            const selectedPrices = getSelectedValues(priceFilters);
            const selectedTypes = getSelectedValues(typeFilters);

            return (
                product.name.toLowerCase().includes(searchTerm) &&
                (selectedGenders.length === 0 || selectedGenders.includes(product.gender)) &&
                (selectedColors.length === 0 || selectedColors.includes(product.color)) &&
                (selectedPrices.length === 0 || selectedPrices.includes(getPriceRange(product.price))) &&
                (selectedTypes.length === 0 || selectedTypes.includes(product.type))
            );
        });

        filteredProducts.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("product-card");
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>Price: ${formatPrice(product.price)}</p>
                <button class="add-to-cart">Add to Cart</button>
            `;
            productList.appendChild(card);

            // Add a click event listener to the "Add to Cart" button
            const addToCartButton = card.querySelector(".add-to-cart");
            addToCartButton.addEventListener("click", () => addToCart(product));
        });
    }

    function getSelectedValues(checkboxes) {
        const selectedValues = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedValues.push(checkbox.value);
            }
        });
        return selectedValues;
    }

    function getPriceRange(price) {
        if (price <= 250) return "0-250";
        if (price <= 450) return "251-450";
        return "451";
    }

    searchInput.addEventListener("input", updateProductCards);
    genderFilters.forEach(filter => filter.addEventListener("change", updateProductCards));
    colorFilters.forEach(filter => filter.addEventListener("change", updateProductCards));
    priceFilters.forEach(filter => filter.addEventListener("change", updateProductCards));
    typeFilters.forEach(filter => filter.addEventListener("change", updateProductCards));

    // Initial rendering
    updateProductCards();
}

// Function to add a product to the cart
function addToCart(product) {
    cartItems.push(product);

    // Increase the cart count
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = cartItems.length;
}

// Function to display the cart items
function displayCartItems() {
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";

    cartItems.forEach(product => {
        const cartItem = document.createElement("li");
        cartItem.textContent = product.name;
        cartList.appendChild(cartItem);
    });
}

// Load custom data and start rendering
loadCustomData();
