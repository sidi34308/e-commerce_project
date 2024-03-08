


// code for reading from a product json file 
    let http = new XMLHttpRequest();

    http.open('GET', 'products.json', true);
    http.send();
    http.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            let products = JSON.parse(this.responseText);
            console.log(products);
            let output = '';

            for (let item of products) {
                output += ` 
                    <div class="card">
                    <div class="image-container">
                        <img src="${item.image}" alt="Product Image">
                    </div>
                    <div class="details">
                        <div class="product-name">${item.productname}</div>
                        <div class="price">${item.price}</div>
                    </div>
                    <div class="addCart" data-id="${item.id}"><button>Add to cart</button></div>
                </div>
            
                `;
            }
            document.querySelector(".cards-container").innerHTML = output;
            
            
            //for adding to the card
            let cart = [];

            const setProductInCart = (productId, quantity, position) => {
                if (quantity > 0) {
                    if (position < 0) {
                        cart.push({
                            product_Id: productId,
                            quantity: quantity
                        });
                    } else {
                        cart[position].quantity = quantity;
                    }
                }
                refreshCartHtml();
            };
            
            const refreshCartHtml = () => {
                let listHtml =document.querySelector('.listcart');
                let totalHtml = document.querySelector('.icon-cart span');
                let totalQuantity = 0;
                cart.forEach(item => {
                    totalQuantity = totalQuantity+ item.quantity;
                });
                totalHtml.innerHTML = totalQuantity;
            }
            document.addEventListener('click', (event) => {
                let buttonClick = event.target;
                let productId = buttonClick.dataset.id;
                let position = cart.findIndex((value) => value.product_Id == productId);
                let quantity = position < 0 ? 0 : cart[position].quantity;
            
                if (buttonClick.classList.contains('addCart')) {
                    quantity++;
                    setProductInCart(productId, quantity, position);
                }
            });
            
            console.log("cart");

            console.log(cart);

            


        }
    }
// code for cart 
document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.remove('activeTabCart');
    let iconCart = document.querySelector('.icon-cart');
    let closebtn= document.querySelector('.cart-tab .close');
    let body = document.querySelector('body');
    closebtn.addEventListener('click',() => {
        body.classList.toggle('activeTabCart');
    });

    iconCart.addEventListener('click',() => {
        body.classList.toggle('activeTabCart');
    });
});
