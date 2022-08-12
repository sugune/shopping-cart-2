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
  
}

// local storage
class Storage {
  
}

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();
  
  products.getProducts().then(data => {console.log(data)});
});




