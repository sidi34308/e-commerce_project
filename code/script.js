
  // _____________________________________________________________________________
    let http = new XMLHttpRequest();

    http.open('GET', 'products.json', true);
    http.send();
    http.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            let products = JSON.parse(this.responseText);
            let output = '';

            for (let item of products) {
                output += ` 
                    <div class="card">
                        <div class="image-container">
                            <img src="${item.image}" alt="Product Image">
                        </div>
                        <div class="details">
                            <div class="product-name">${item.productname}</div>
                            <div class="price" ">${item.price}</div>
                        </div> 
                    </div>
                `;
            }
            document.querySelector(".cards-container").innerHTML = output;
        }
    }