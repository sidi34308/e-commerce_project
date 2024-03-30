document.addEventListener("DOMContentLoaded", function() {
    let users = [];
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    users = storedUsers;
    console.log(users);

    let cart = [];
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    cart = storedCart;
    console.log(cart);

    let products = [];
    let storedProducts = JSON.parse(localStorage.getItem('products'));
    products = storedProducts;
    console.log(products);

    let logged_in_user = [];
    const retrievedUser = JSON.parse(localStorage.getItem('logged_in_user'));
    logged_in_user = retrievedUser;
    console.log(logged_in_user);

    function calculateTotal(cart) {
        let total = 0;
        for (const cartItem of cart) {
            const product = fetchProduct(cartItem.product_Id);
            if (product) {
                total += cartItem.quantity * product.price;
            }
        }
        return total;
    }

    function displayUserInfoAndTotal(logged_in_user, cart) {
        const usernameElement = document.querySelector('.username');
        const totalElement = document.querySelector('.total');

        if (logged_in_user && logged_in_user.name) {
            usernameElement.textContent = `Hello, ${logged_in_user.name}!`;
        } else {
            usernameElement.textContent = "Hello!";
        }
        const totalAmount = calculateTotal(cart);
        totalElement.textContent = `Total: ${totalAmount} QR`;
    }

    displayUserInfoAndTotal(logged_in_user, cart);

    function checkout() {
        const total = calculateTotal(cart);
        console.log("Total amount:", total);
        console.log("User balance:", logged_in_user.balance);

        if (total < logged_in_user.balance) {
            const remainingBalance = logged_in_user.balance - total;
            logged_in_user.balance = remainingBalance;
            console.log("Remaining balance:", logged_in_user.balance);

            transferAmount(total);
            addToPastHistory();
            updateUser(users, logged_in_user);
            localStorage.setItem('logged_in_user', JSON.stringify(logged_in_user));
            // Display success message and redirect to main page
            alert("Purchase successful!");
            window.location.href = 'home.html';
        } else {
            // Display error message for insufficient balance
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = "Insufficient balance to purchase these items.";
            errorMessage.style.display = 'block';
        }
    }

    function transferAmount(total) {
        cart.forEach(item => {
            for (const product of products) {
                if (item.product_Id == product.id) {
                    product.quantity -= item.quantity;
                    updateSellerBalance(product.seller_ID, total);
                }
            }
        });
    }

    function updateSellerBalance(sellerId, amount) {
        users.forEach(user => {
            if (user.type == "seller" && user.id == sellerId) {
                console.log("Old balance for seller", user.id, ":", user.balance);
                user.balance += amount;
                console.log("New balance for seller", user.id, ":", user.balance);
            }
        });
    }

    function addToPastHistory() {
        cart.forEach(item => {
            const product = fetchProduct(item.product_Id);
            if (product) {
                product.quantity = item.quantity;
                logged_in_user.past_purchases.push(product);
            }
        });
    }

    function updateUser(users, updatedUser) {
        const userIndex = users.findIndex(user => user.id === updatedUser.id);

        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            console.log('User updated successfully:', updatedUser);
        } else {
            console.error('User not found for update');
        }
    }

    // Fetch product function
    function fetchProduct(id) {
        return products.find(product => product.id == id);
    }

    // Form submission handling
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        checkout();
    });
});
