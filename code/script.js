
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
});

window.addEventListener('load', function() {
    // Functionality to fetch and display products
    const http = new XMLHttpRequest();
    http.open('GET', 'products.json', true);
    http.send();

    http.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            const products = JSON.parse(this.responseText);
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

            // Cart functionality
            let cart = [];

            const refreshCartCounter = () => {
                const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
                document.querySelector('.icon-cart span').innerHTML = totalQuantity;
            };

            const buttonsAddToCart = document.querySelectorAll('.addCart');
            buttonsAddToCart.forEach(button => {
                button.addEventListener('click', () => {
                    const productId = button.dataset.id;
                    const existingProductIndex = cart.findIndex(item => item.product_Id === productId);

                    if (existingProductIndex !== -1) {
                        cart[existingProductIndex].quantity++;
                    } else {
                        cart.push({ product_Id: productId, quantity: 1 });
                    }

                    refreshCartCounter();
                    renderCart();
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
                                    <label for="quantity">Quantity:</label>
                                    <input type="number" id="quantity" name="quantity" min="1" value="${cartItem.quantity}">
                                    <div class="remove" data-id="${cartItem.product_Id}">
                                        <img src="media/Remove.png"></img>
                                    </div>
                                </div>
                            </div>`;
                        
                        totalPrice += cartItem.quantity * fetchProductPrice(cartItem.product_Id);
                    }
                });

                document.querySelector('.listcart').innerHTML = cartHTML;
                
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
           
        }
    };
});
