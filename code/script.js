document.addEventListener("DOMContentLoaded", function() {
    // Functionality to toggle cart visibility
    const body = document.querySelector('body');
    const iconCart = document.querySelector('.icon-cart');
    const closeBtn = document.querySelector('.cart-tab .close');

    closeBtn.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    });
    
    iconCart.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    });
    
    const iconAccount = document.querySelector('.icon-account');
    const userPopup = document.getElementById('userPopup');

    iconAccount.addEventListener('click', function() {
        // Toggle visibility of user pop-up
        userPopup.style.display = (userPopup.style.display === 'block') ? 'none' : 'flex';
        // Add animation class
        userPopup.classList.toggle('animate__animated');
        userPopup.classList.toggle('animate__fadeIn');
    });

    // Close user pop-up when clicking outside
    document.addEventListener('click', function(event) {
        if (!iconAccount.contains(event.target) && !userPopup.contains(event.target)) {
            userPopup.style.display = 'none';
        }
    });
    
});
// account tab 
function togglePopup() {
        var overlay = document.getElementById("login-overlay");
        var container = document.getElementById("popup-1");
        overlay.style.display = container.classList.toggle("active") ? "block" : "none";
}
//the User info


// Functionality to fetch and display users
const http_users = new XMLHttpRequest();
let users;

http_users.open('GET', 'users.json', true);
http_users.send();

http_users.onload = function() {
    if (this.readyState == 4 && this.status == 200) {
        users = JSON.parse(this.responseText); // Assign the parsed JSON data to the users variable

       
    }
}
//this here is for saving which user is logged in unless he sign out

let logged_in_user =[];



window.addEventListener('load', function() {
    const retrievedUser = localStorage.getItem('logged_in_user');
    if (retrievedUser) {
        logged_in_user = JSON.parse(retrievedUser);
        console.log('User logged in:', logged_in_user.name);
        // You may need to update the UI here based on the logged_in_user data
    } else {
        console.log('No user logged in.');
    }
    function handleLogin(users) {
        // Get the input values
        var username = document.querySelector('.login-input[name="uname"]').value;
        var password = document.querySelector('.login-input[name="psw"]').value;
        
        let found = false;

        // Find the user with the matching username and password
        for (let user of users) {
            if (user.name === username && user.password === password) {
                found = true;
                
                logged_in_user=user;
                console.log(logged_in_user);
                console.log("Logined in usesddr is",logged_in_user.name);
                const userPopup = document.getElementById("userPopup");

                const userimage = document.createElement("img");
                console.log(logged_in_user.image);
                userimage.src = `${logged_in_user.image}`;

                const userName = document.createElement("h3");
                userName.textContent = logged_in_user.name;
            
                const balance = document.createElement("p");
                balance.textContent = "Balance: " + logged_in_user.balance + " QR";


                const signOutButton = document.createElement("button");
                signOutButton.textContent = "Sign Out";
             
                signOutButton.addEventListener("click", () => {
                    logged_in_user=[];
                    console.log(logged_in_user);
                    console.log("you are logged-out");
                    const userPopup = document.getElementById("userPopup");
    
                    const userimage = document.createElement("img");
                    userimage.src = "media/icons/account-black.png";
    
                    const userName = document.createElement("h3");
                    userName.textContent = "  ";

                    const balance = document.createElement("p");
                    balance.textContent = "log in to see your info";

                    const LogInButton = document.createElement("button");
                    LogInButton.textContent = "Log-in";
                
                    LogInButton.addEventListener("click", () =>{ });
                    console.log("Signing out...");
                    userPopup.innerHTML = ""; // Clear previous content
                    userPopup.appendChild(userimage);
                    userPopup.appendChild(userName);
                    userPopup.appendChild(balance);
                    userPopup.appendChild(LogInButton);
                    localStorage.setItem('logged_in_user', JSON.stringify([]));
                });
            

                // Create a sign-out button
              
                userPopup.innerHTML = ""; // Clear previous content
                userPopup.appendChild(userimage);
                userPopup.appendChild(userName);
                userPopup.appendChild(balance);
                userPopup.appendChild(signOutButton);
            // Append user info and sign-out button to the user popup
         
                break; // No need to continue searching once user is found
                
            }
        }

        if (found) {
            // Login successful
            console.log('Login successful! Welcome, ' + username + '!');
            togglePopup(); 
            localStorage.setItem('logged_in_user', JSON.stringify(logged_in_user));
            // You can redirect or perform any other action here
        } else {
            // Login failed
            localStorage.setItem('logged_in_user', JSON.stringify([]));
            console.log('Invalid username or password. Please try again.');
        }
       
    }

    document.querySelector(".login-button").addEventListener("click", () => {
        handleLogin(users);
        console.log("Logined in user is",logged_in_user.name);
       
    });

    // Functionality to fetch and display products
    const http_products = new XMLHttpRequest();
    http_products.open('GET', 'products.json', true);
    http_products.send();

    http_products.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            const products = JSON.parse(this.responseText);
            displayProducts(products); // Display all products initially

            const searchInput = document.getElementById('search-bar');
            searchInput.addEventListener('keyup', function() {
                filterProducts(products, this.value.toLowerCase()); // Filter products based on search input
            });
        }
    };

    function displayProducts(products) {
        let output = '';

        for (const item of products) {
            output += `
                <div class="card ">
                    <div class="image-container">
                        <img src="${item.image}" alt="Product Image">
                    </div>
                    <div class="details">
                        <div class="product-name">${item.productname}</div>
                        <div class="price">${item.price} QR</div>
                    </div>
                    <div class="addCart" data-id="${item.id}">
                        <button>Add to cart</button>
                    </div>
                </div>`;
        }

        document.querySelector(".cards-container").innerHTML = output;
    }

    function filterProducts(products, searchText) {
        const filteredProducts = products.filter(product => product.productname.toLowerCase().includes(searchText));
        displayProducts(filteredProducts);
    }

            // Cart functionality
           


            // Cart functionality
            let cart = [];

            const refreshCartCounter = () => {
                const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
                document.querySelector('.icon-cart span').innerHTML = totalQuantity;
            };

            const buttonsAddToCart = document.querySelectorAll('.addCart');
            buttonsAddToCart.forEach(button => {
                button.addEventListener('click', () => {
                    
                    if (logged_in_user.length < 1) {
                        togglePopup(); 
                    } else {
                     
                    
                   
                    const productId = button.dataset.id;
                    const existingProductIndex = cart.findIndex(item => item.product_Id === productId);

                    if (existingProductIndex !== -1) {
                        cart[existingProductIndex].quantity++;
                    } else {
                        cart.push({ product_Id: productId, quantity: 1 });
                       
                    }

                    refreshCartCounter();
                    renderCart();
                    }
                });
            });

            const fetchProduct = id => {
                return products.find(product => product.id == id);
            };

            const fetchProductPrice = id => { 
                const product = products.find(product => product.id == id);
                return product ? product.price : 0;
            };

            const renderCart = () => {
                let cartHTML = '';
                let totalPrice = 0;

                cart.forEach(cartItem => {
                    const product = fetchProduct(cartItem.product_Id);

                    if (product) {
                        cartHTML += `
                            <div class="cart-card">
                                <img src="${product.image}">
                                <div class="cart-content">
                                    <h4>${product.productname}</h4> 
                                    <div class="cart_card_price">Price: ${product.price} QR</div>
                                    <div class="quantity-dropdown" data-id="${cartItem.product_Id}">
                                    <label for="quantity">Quantity:</label>
                                                    
                                    <select class="quantity-select" data-id="${cartItem.product_Id}" name="quantity">`;
                                    // Generate options for quantity dropdown
                                    for (let i = 1; i <= product.quantity; i++) {
                                        cartHTML += `<option value="${i}" ${i === cartItem.quantity ? 'selected' : ''}>${i}</option>`;
                                    }
                                    cartHTML += `</select>
                                    </div>
                                    <div class="remove" data-id="${cartItem.product_Id}">
                                        <img src="media/Remove.png"></img>
                                    </div>
                                </div>
                            </div>`;
                        
                        totalPrice += cartItem.quantity * fetchProductPrice(cartItem.product_Id);
                    }
                });

                document.querySelector('.listcart').innerHTML = cartHTML;
                
                const quantitySelects = document.querySelectorAll('.quantity-select');
                quantitySelects.forEach(select => {
                    select.addEventListener('change', function() {
                        const productId = this.getAttribute('data-id');
                        const selectedQuantity = parseInt(this.value);
                        // Now you can use productId and selectedQuantity as needed
                        console.log('Product ID:', productId);
                        console.log('Selected Quantity:', selectedQuantity);
                
                        // Update the quantity of the item in the cart
                        cart.forEach(item => { 
                            if (item.product_Id === productId) { // Adjust this comparison according to your cart item structure
                                item.quantity = selectedQuantity;
                            }
                        });
                
                        // Refresh total price and cart counter
                        refreshTotalprice(cart);
                        refreshCartCounter();
                    });
                });
                let removeButtons = document.querySelectorAll('.remove');
                removeButtons.forEach(removeButton => {
                    removeButton.addEventListener('click', () => {
                        const productId = removeButton.dataset.id;
                        removeFromCart(productId);
                    });
                });
                
                let totalcart = (cart) => {
                    let total = cart.reduce((acc,val)=> acc+=parseInt(val.quantity)*parseInt(fetchProductPrice(val.product_Id)),0);
                    return total;
                };
                const refreshTotalprice = (cart) => {
                    const total = totalcart(cart);
                    document.querySelector('#cart-total').innerHTML = total;
                };

                const removeFromCart= (pid) => {
                        console.log("im here",pid);
                        const theTargetProduct = cart.findIndex(item => item.product_Id === pid);
                        console.log(theTargetProduct);
                        cart.splice(theTargetProduct, 1);
                        // renderCart();
                        // refreshTotalprice(cart);
                        renderCart();
                        refreshCartCounter();
                        refreshTotalprice(cart);

                };
               
                refreshTotalprice(cart);
                totalcart(cart);
                
            };
           
        
});
