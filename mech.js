// elements

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

// cart
let cart = [];

// buttons
let buttonsDOM;

// getting the products
class Products {
  async getProducts() {
    try {
      const res = await fetch('./products.json');
      const data = await res.json();
      let products = data.items;
      products = products.map(item => {
        const {title, price} = item.fields;
        const {id} = item.sys;
        const image = item.fields.image.fields.file.url;
        return {title, price, id, image};
      });
      return products;
    } catch (e) {
      console.log(e)
    }
  }
  
}

// display the products
class UI {
  displayProducts(products) {
    let result = [];
    products.forEach(product => {
      result.push(`
      <!-- single product -->
      <aticle class="product">
        <div class="img-container">
          <img src="${product.image}" alt="image product" class="product-img">
          <button class="bag-btn" data-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> 
            add to bag
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
      </aticle>
      <!-- end of single product -->`);
    });
    return result.join('');
  }
  
  workButton() {
    const buttons = [...document.querySelectorAll('.bag-btn')];
    buttonsDOM = buttons;
    buttons.forEach((btn) => {
      const id = btn.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        btn.innerText = 'In Cart';
        btn.disabled = true;
      }
      btn.addEventListener('click', (e) => {
        e.currentTarget.innerText = 'In Cart';
        e.target.disabled = true;
        
        const item = {...Storage.getProducts(id), amount:1};
        // add item in Cart
        cart = [...cart, item];
        // save in storage
        Storage.saveCart(cart);
        // set cart value
        this.setCartValue(cart);
        // display cart items
        this.addCartItems(item);
        // show cart
        //this.showCart();
        });
    });
  }
  
  setCartValue(cart) {
    let tempTotal = 0;
    let tempItems = 0;
    cart.forEach(item => {
      tempTotal += item.price * item.amount;
      tempItems += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = tempItems;
  }
  
  addCartItems(item) {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
    <img src="${item.image}" alt="product1">
            <div>
              <h4>${item.title}</h4>
              <h5>$${item.price}</h5>
              <span class="remove-item" data-id="${item.id}">remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id="${item.id}"></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id="${item.id}"></i>
            </div>`;
    cartContent.appendChild(div);
  }
  
  showCart() {
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart');
  }
  
  setUpAPP() {
    cart = Storage.getCart();
    this.setCartValue(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);
  }
  
  populateCart(cart) {
    cart.forEach(item => {
      this.addCartItems(item)
    });
  }
  
  hideCart() {
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart');
  }
  
  cartLogic() {
    clearCartBtn.addEventListener('click', () => {
      this.clearCart();
      this.hideCart();
    });
    
    cartContent.addEventListener('click', e => {
      if (e.target.classList.contains('remove-item')) {
        const id = e.target.dataset.id;
        cartContent.removeChild(e.target.parentElement.parentElement);
        this.removeItem(id);
      } else if (e.target.classList.contains('fa-chevron-up')) {
        const upArrow = e.target;
        const id = upArrow.dataset.id;
        let tempCart = cart.find(item => item.id === id);
        tempCart.amount = tempCart.amount + 1;
        Storage.saveCart(cart);
        this.setCartValue(cart);
        upArrow.nextElementSibling.innerHTML = tempCart.amount;
      } else if (e.target.classList.contains('fa-chevron-down')) {
        const downArrow = e.target;
        const id = downArrow.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart();
          this.setCartValue(cart);
          downArrow.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(e.target.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  
  clearCart() {
    const cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
  }
  
  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    const button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
  }
  
  getSingleButton(id) {
    return buttonsDOM.find(btn => btn.dataset.id === id);
  }
  
}

// local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }
  static getProducts(id) {
    const products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();
  
  // setup existing Storage
  ui.setUpAPP();
  
  products.getProducts().then(data => {
    productsDOM.innerHTML = ui.displayProducts(data);
    Storage.saveProducts(data);
  }).then(() => {
    ui.workButton();
    ui.cartLogic();
  });
});




