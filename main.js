//import './style.css'
//import './assets/styles.css'
//import './assets/mediaqueries.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

// Lista de APis de productos
// https://dummyjson.com/products
// esto de limit 0 es para mostrar tooooooodos lo productos de la api
//https://dummyjson.com/products?limit=0


/*
document.querySelector('#app').innerHTML = `
  <!--
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
  -->
`
setupCounter(document.querySelector('#counter'))
*/


const UrlAllProducts = 'https://dummyjson.com/products?limit=0'
const producstCatalog = document.querySelector('#products-catalog');

// Elementos del menu
const menuBtn = document.querySelector('.menu-label');
const barsMenu = document.querySelector('.navbar-list');

// Elementos del carrito
const cartBtn = document.querySelector(".cart-label");
const cartMenu = document.querySelector(".cart");

const overlay = document.querySelector('.overlay');

const cartCross = document.querySelector('.cart-cross');


const createProductTemplate = (product)=>{
  const {id, title, description, category, price, stock, tags, brand, 
  sku, meta, images, thumbnail} = product


  let quantity = 0;

  return `
  <div class="product-card">
    <img class="product-image" src="${images[0]}" alt="Imagen del producto">
    <!-- <img class="product-image" src="${thumbnail}" alt="Imagen del producto"> -->
    <p>${id}</p>
    <h2 class="product-title">${title}</h2>
    <p class="product-description">${description}</p>
    <p class="product-price">$ ${price}</p>

    <!--
    <div class="quantity-container">
      <span class="quantity-handler down" data-id=${id}>-</span>
      <span class="item-quantity">${quantity}</span>
      <span class="quantity-handler up" data-id=${id}>+</span>
    </div>
    -->

    <div class="button-container">
      <button class="btn-cart">
        Agregar
        <img class="btn-logo" src="https://img.icons8.com/?size=100&id=ii6Lr4KivOiE&format=png&color=FFFFFF" alt="logo-cart">
      </button>
    </div>
  </div>`
}

const createCartProductTemplate = (item)=>{
  const {name, bid, quantity, img, id} = item;
  return `
      <div class="cart-item">
          <img src=${img} alt="NFT del carrito">
          <div class="item-info">
              <h3 class="item-title">${name}</h3>
              <p class="item-bid">Current bid</p>
              <span class="item-price">${bid}</span>
          </div>
          <div class="item-handler">
              <span class="quantity-handler down" data-id=${id}>-</span>
              <span class="item-quantity">${quantity}</span>
              <span class="quantity-handler up" data-id=${id}>+</span>
          </div>
      </div>
  `;
}

const getAllProducts = async()=>{
  try{
    const response = await fetch(UrlAllProducts)
    const data = await response.json()
    return data.products;
  }
  catch(err){
    console.log("Se ha producido un error desconocido -> " + err);
  }
}

/* 
// Cree esta funcion unicamente para formatear toda la coleccion de productos
// a templeates de html y testeando la funcion async y await la desahbilito por que parece redundante
const structureData = async()=>{
  try {
    const products = await getAllProducts()
    let templates = products.map(product => createProductTemplate(product)).join('')
    return templates;
  } catch (error) {
    console.log("Error al renderizar los elementos");
  }
}
*/

const rederProducts = async() =>{
  try {
    const products = await getAllProducts()
    //producstCatalog.innerHTML = await structureData();
    let templates = products.map(product => createProductTemplate(product)).join('')
    producstCatalog.innerHTML = templates;    
  } catch (error) {
    console.log("Error al renderizar los elementos");
  }
}

const toggleMenu = () =>{
  console.log("click en menu");
  
  barsMenu.classList.toggle("open-menu");
  console.log(barsMenu);
  if(cartMenu.classList.contains("open-cart")){
      cartMenu.classList.remove("open-cart");
      return
  }
  overlay.classList.toggle("show-overlay");
}

const toggleCart = () =>{
  cartMenu.classList.toggle("open-cart");
  if(barsMenu.classList.contains("open-menu")){
    barsMenu.classList.remove("open-menu");
    return
  }
  overlay.classList.toggle('show-overlay');
}

const closeOnClick = (e)=>{
  if(e.target.classList.contains("navbar-link")) return
  barsMenu.classList.remove("open-menu");
  overlay.classList.remove("show-overlay");
}

const closeOnOverlayClick = ()=>{
  cartMenu.classList.remove("open-cart");
  barsMenu.classList.remove("open-menu");
  overlay.classList.remove("show-overlay");
}

const closeOnScroll = ()=>{
  if(barsMenu.classList.contains("open-menu") || cartMenu.classList.contains("open-cart")){
      cartMenu.classList.remove("open-cart");
      barsMenu.classList.remove("open-menu");
      overlay.classList.remove("show-overlay");
  }
}



const init = async() =>{
  rederProducts();

  menuBtn.addEventListener("click", toggleMenu)
  barsMenu.addEventListener("click", closeOnClick);

  cartBtn.addEventListener("click", toggleCart)
  cartCross.addEventListener("click", toggleCart)
  overlay.addEventListener("click", closeOnOverlayClick)

  window.addEventListener("scroll", closeOnScroll);
}

init();