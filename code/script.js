

document.addEventListener("DOMContentLoaded", function() {
    
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
        userPopup.style.display = (userPopup.style.display === 'block') ? 'none' : 'flex';
        userPopup.classList.toggle('animate__animated');
        userPopup.classList.toggle('animate__fadeIn');
    });

    document.addEventListener('click', function(event) {
        if (!iconAccount.contains(event.target) && !userPopup.contains(event.target)) {
            userPopup.style.display = 'none';
        }
    });

    // Account tab 
    function togglePopup() {
        var overlay = document.getElementById("login-overlay");
        var container = document.getElementById("popup-1");
        overlay.style.display = container.classList.toggle("active") ? "block" : "none";
    }
    const loginButton = document.querySelector('.cancel');
    loginButton.addEventListener('click', togglePopup);
   

   
   
    // const storedUsers = JSON.parse(localStorage.getItem('users'));
    // console.log("s", storedUsers.length); // Corrected from storedUsers.lenght to storedUsers.length
    // if (!storedUsers || storedUsers.length==0) {
    //     console.log("here")
    //     const http_users = new XMLHttpRequest();
    //     http_users.open('GET', 'users.json', true);
    //     http_users.send();
    
    //     http_users.onload = () => {
    //         if (this.readyState == 4 && this.status == 200) {
    //             users = JSON.parse(this.responseText); 
    //             console.log("Response from 'users.json':", users);
    //             localStorage.setItem('users', JSON.stringify(users));
    //             console.log("Users fetched from JSON file:", users);
    //         }
    //     };
       
    // } else {
    //     users = storedUsers;
    // }

    let users = [];

    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
        const http_users = new XMLHttpRequest();
        http_users.open('GET', 'users.json', true);
        http_users.send();

        http_users.onload = function() {
            if (this.readyState == 4 && this.status == 200) {
                users = JSON.parse(this.responseText);
                localStorage.setItem('users', JSON.stringify(users));
            }
        };
    } else {
        users = JSON.parse(storedUsers);
    }

    
    
    console.log("All users:", users);
    


   
    const renderSignOut = (logged_in_user) => {
        console.log("Logging out...");
        logged_in_user = [];
        updateNavigationBarForSeller();
        console.log("Logged-out user:", logged_in_user);
        
    
        // Update user info in the UI
        const userPopup = document.getElementById("userPopup");
        const userimage = document.createElement("img");
        userimage.src = "media/icons/account-black.png";
        const userName = document.createElement("h3");
        userName.textContent = "  ";
        const balance = document.createElement("p");
        balance.textContent = "Sign in to see your info";
        const LogInButton = document.createElement("button");
        LogInButton.textContent = "Sign in";
        LogInButton.addEventListener("click", () => togglePopup());
        
        userPopup.innerHTML = ""; // Clear previous content
        userPopup.appendChild(userimage);
        userPopup.appendChild(userName);
        userPopup.appendChild(balance);
        userPopup.appendChild(LogInButton);
    
        // Clear localStorage
        cart=[];
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.removeItem('logged_in_user');
        console.log("User logged out successfully!");
    };
    
    
    
    const renderLoginState = (logged_in_user) => {
        console.log(logged_in_user);
        console.log("Logined in user is", logged_in_user.name);
        const userPopup = document.getElementById("userPopup");
        const userimage = document.createElement("img");
        console.log(logged_in_user.image);
        userimage.src = `${logged_in_user.image}`;
        const userName = document.createElement("h3");
        userName.textContent = logged_in_user.name;
        const balance = document.createElement("p");
        balance.textContent = "Balance: " + logged_in_user.balance + " QR";
    
        // Create an h4 for "Past Purchases"
        const pastPurchasesHeading = document.createElement("h4");
        pastPurchasesHeading.textContent = "Past Purchases";
        pastPurchasesHeading.classList.add("past-purchases-heading");
    
        // Create a list to display past purchases
        const pastPurchasesList = document.createElement("ul");
        pastPurchasesList.classList.add("past-purchases");
    
        // Loop through past purchases and create list items for each
        console.log("past history", logged_in_user)
        logged_in_user.past_purchases.forEach(purchase => {
            const listItem = document.createElement("li");
            listItem.textContent = `${purchase.productname} - ${purchase.price} QR`;
            pastPurchasesList.appendChild(listItem);
        });
    
        const signOutButton = document.createElement("button");
        signOutButton.textContent = "Sign Out";
    
        userPopup.innerHTML = "";
        userPopup.appendChild(userimage);
        userPopup.appendChild(userName);
        userPopup.appendChild(balance);
        userPopup.appendChild(pastPurchasesHeading); // Append the h4 heading
        userPopup.appendChild(pastPurchasesList); // Append the past purchases list
        userPopup.appendChild(signOutButton);
    
        signOutButton.addEventListener("click", () => {
            console.log("is trying to sign out", logged_in_user);
            renderSignOut(logged_in_user);
        });
    };
    

    let logged_in_user = [];

    let cart = [];

    const storedCart = localStorage.getItem('cart');
    console.log("that is the stord cart",JSON.parse(storedCart));
    if (storedCart && storedCart.length != 0) {
        cart = JSON.parse(storedCart);
        console.log("new cart", cart);
      
    } else {
        console.log("No  cart found in local storage");
    }

    
    const retrievedUser = JSON.parse(localStorage.getItem('logged_in_user'));
    console.log("retrieved user from localStorage:", retrievedUser);
    
    if (retrievedUser && retrievedUser.length != 0) {
        logged_in_user = retrievedUser;
        console.log("Logged-in user exists:", logged_in_user.name);
        renderLoginState(logged_in_user);
    } else {
        console.log("No logged-in user found in local storage");
        renderSignOut(logged_in_user);
    }
    
    function handleLogin(users) {
            var username = document.querySelector('.login-input[name="uname"]').value;
            var password = document.querySelector('.login-input[name="psw"]').value;
            var loginError = document.getElementById('login-error');

            let found = false;

            for (let user of users) {
                if (user.name === username && user.password === password) {
                    found = true;
                    logged_in_user=user;
                    if( logged_in_user.type=="seller"){
                        window.location.href = 'seller.html';
                    }
                    renderLoginState(logged_in_user);
                    break; 
                    
                }
            }

            if (found) {
                console.log('Login successful! Welcome, ' + username + '!');
                loginError.style.display = 'none';

                togglePopup(); 
                localStorage.setItem('logged_in_user', JSON.stringify(logged_in_user));

            } else {
                loginError.style.display = 'block';
                console.log('Invalid username or password. Please try again.');
            }
        
        }

        document.querySelector(".login-button").addEventListener("click", () => {
            handleLogin(users);
            console.log("Logined in user is",logged_in_user.name);
        
        });

        let products = [];
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            products = JSON.parse(storedProducts);
            renderFilteredProducts(products);
        } else {
            const http_products = new XMLHttpRequest();
            http_products.open('GET', 'products.json', true);
            http_products.send();
    
            http_products.onload = function() {
                if (this.readyState == 4 && this.status == 200) {
                    products = JSON.parse(this.responseText);
                    localStorage.setItem('products', JSON.stringify(products));
                    renderFilteredProducts(products);
                }
            };
        }

        function renderFilteredProducts(filteredProducts) {
            let output = '';
            for (const item of filteredProducts) {
                output += `
                    <div class="card">
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
            if (output == '') {
                output += `
                    <div class="err">
                        <h1 class="noitemfound">No Item Found!</h1>
                    </div>`;
            }
        
            document.querySelector(".cards-container").innerHTML = output;
        
            attachAddToCartListeners();
        }
        
        function filterProducts(products, searchText) {
            const filteredProducts = products.filter(product => product.productname.toLowerCase().includes(searchText));
            renderFilteredProducts(filteredProducts);
        }
        
        const searchInput = document.querySelector('#search-bar');
        searchInput.addEventListener('keyup', function() {
            filterProducts(products, this.value.toLowerCase());
        });


        const refreshCartCounter = () => {
            const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
            document.querySelector('.icon-cart span').innerHTML = totalQuantity;
        };

        function attachAddToCartListeners() {
            const buttonsAddToCart = document.querySelectorAll('.addCart');
            buttonsAddToCart.forEach(button => {
                button.addEventListener('click', () => {
                    console.log("g", logged_in_user);
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
                        localStorage.setItem('cart', JSON.stringify(cart));
        
                    }
                });
            });
        }

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
                localStorage.setItem('cart', JSON.stringify(cart));

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
                    localStorage.setItem('cart', JSON.stringify(cart));

                });
            });

            
            let removeButtons = document.querySelectorAll('.remove');
            removeButtons.forEach(removeButton => {
                removeButton.addEventListener('click', () => {
                    const productId = removeButton.dataset.id;
                    removeFromCart(productId);
                });
            });


            let checkoutbutton = document.querySelector(".checkout");
            checkoutbutton.addEventListener("click", () => {
                if (logged_in_user && logged_in_user.name) {
                    window.location.href = 'checkout.html';
                } else {
                    togglePopup();
                }
            });


            let totalcart = (cart) => {
                let total = cart.reduce((acc,val)=> acc+=parseInt(val.quantity)*parseInt(fetchProductPrice(val.product_Id)),0);
                return total;
            };
            const refreshTotalprice = (cart) => {
                const total = totalcart(cart);
                document.querySelector('#cart-total').innerHTML = total;
            };
      
            //to here _______________________________________________________
            const removeFromCart= (pid) => {
                    console.log("im here",pid);
                    const theTargetProduct = cart.findIndex(item => item.product_Id === pid);
                    console.log(theTargetProduct);
                    cart.splice(theTargetProduct, 1);
                    renderCart();
                    refreshCartCounter();
                    refreshTotalprice(cart);
                    localStorage.setItem('cart', JSON.stringify(cart));

            };
            const addToPastHistory =()=>{
                cart.forEach(item => {
                    let product = fetchProduct(item.product_Id);
                    product.quantity = item.quantity;
                    logged_in_user.past_purchases.push(product);

                });
            };
            const TransferAmount = (total) =>{
                cart.forEach(item => {
                    console.log(item.quantity);
                    for (let product of products) {
                        if (item.product_Id == product.id) {
                            product.quantity = product.quantity - item.quantity;
                            console.log(product.seller_ID);
                            updateSellerBalance(product.seller_ID,total);
                        }
                    }

                    
                })

            }
            const updateSellerBalance = (sellerid,amount) => {
                users.forEach(user => {
                    if (user.type=="seller" && user.id==sellerid){
                        console.log("old balance ",user.balance);
                        user.balance+=amount;
                        console.log("new balance",user.balance);

                    }
                });
            }
       
            refreshTotalprice(cart);
            totalcart(cart);
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('users', JSON.stringify(users));


            
        };

        localStorage.setItem('users', JSON.stringify(users));   
        refreshCartCounter();
        renderCart();


   
// Navigating to Dashboard for seller
function updateNavigationBarForSeller() {
    const dashboardNav = document.getElementById('seller-dashboard-nav');
    if (logged_in_user && logged_in_user.type === "seller") {
        dashboardNav.style.display = 'block'; 
    } else {
        dashboardNav.style.display = 'none'; 
    }
}

updateNavigationBarForSeller();


});
