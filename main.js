/*
  import './style.css'
  import './assets/styles.css'
  import './assets/mediaqueries.css'
  import javascriptLogo from './javascript.svg'
  import viteLogo from '/vite.svg'
  import { setupCounter } from './counter.js'
*/
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


// Elementos del menu
const menuBtn = document.querySelector('.menu-label');
const barsMenu = document.querySelector('.navbar-list');

// Elementos del carrito
const cartBtn = document.querySelector(".cart-label");
const cartMenu = document.querySelector(".cart");
const cartCross = document.querySelector('.cart-cross');
const cartMessage = document.querySelector('.cart-message');
const productsCart  = document.querySelector('.cart-container');
const cartTotal  = document.querySelector('.cart-total');
const btnBuy  = document.querySelector('.btn-buy');
const btnDelete  = document.querySelector('.btn-delete');
const divider = document.querySelector('.divider');
const cartBody = document.querySelector(".cart-body");
const deleteIcon = document.querySelector(".delete-icon");






// Elementos de los productos
const btnAdd = document.querySelector('.btn-add');
const productsContainer = document.querySelector(".products-container");





// Otros elementos
const modal = document.querySelector('.add-modal');
const overlay = document.querySelector('.overlay');
const cartLabelModal = document.querySelector(".cart-label-modal");





let cart = JSON.parse(localStorage.getItem("cart")) || [];

const saveCart = ()=>{
  localStorage.setItem('cart', JSON.stringify(cart));
}









const createProductTemplate = (product)=>{
  const {id, title, description, category, price, stock, tags, brand, 
  sku, meta, images, thumbnail} = product

  return `
  <div class="product-card">
    <img class="product-image" src="${images[0]}" alt="Imagen del producto">
    <!-- <img class="product-image" src="${thumbnail}" alt="Imagen del producto"> -->
    <p>${id}</p>
    <h2 class="product-title">${title}</h2>
    <p class="product-description">${description}</p>
    <p class="product-price">$ ${price}</p>
    <div class="button-container">
      <button 
        class="btn-add"
        data-id="${id}"
        data-title="${title}"
        data-price="${price}"
        data-thumbnail="${thumbnail}"
        >
        Agregar
        <img class="btn-logo" src="https://img.icons8.com/?size=100&id=ii6Lr4KivOiE&format=png&color=FFFFFF" alt="logo-cart">
      </button>
    </div>
  </div>`
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
    productsContainer.innerHTML = templates;    
  } catch (error) {
    console.log("Error al renderizar los elementos" + error);
  }
}

// Funciones para los eventos
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

const verifyItemsCart = () =>{
  if(!cart.length){
    productsCart.classList.add("hidden")
    cartTotal.classList.add("hidden")
    btnBuy.classList.add("hidden")
    btnDelete.classList.add("hidden")
    divider.classList.add("hidden")
    if(cartMessage.classList.contains("hidden")){
      cartMessage.classList.remove("hidden")
      cartBody.classList.add("flex-column-center");
      cartMessage.textContent = "No tienes productos en tu carrito."
    }   
    return
  }
}

const toggleCart = () =>{
  cartMenu.classList.toggle("open-cart");
  verifyItemsCart();
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


// Funciones para el carrrito
const createCartProductTemplate = (item)=>{
  const {id, title, price, thumbnail, quantity} = item;
  return `
    <div class="cart-item">
        <img src=${thumbnail} alt="NFT del carrito">
        <div class="item-info">
            <h3 class="item-title">${title}</h3>
            <p class="item-bid">Current bid</p>
            <span class="item-price">${price}</span>
        </div>
        <div class="item-handler">
            <span class="quantity-handler down" data-id=${id}>-</span>
            <span class="item-quantity">${quantity}</span>
            <span class="quantity-handler up" data-id=${id}>+</span>
            <i class="fa-solid fa-trash delete-icon" data-id=${id}></i>
        </div>
    </div>
  `;
}

const removeProductFromCart = (productID) =>{
  cart = cart.filter(product => product.id !== productID)
}

const createCartProduct = (product) => {
  cart = [...cart, {...product, quantity: 1}];
}

const isExistingCartProduct = (productID) => {
  return cart.find(product => product.id === productID)
}

const addUnitToProductCart = (productID) =>{
  cart = cart.map(product =>{
    return product.id === productID?
      {...product, quantity: product.quantity + 1}
      : product;
  })
}

const substractProductUnit = (productID) =>{
  cart = cart.map((product) => {
    return product.id === productID ?
      {...product, quantity: product.quantity - 1}
      : product
  })
}

const handleMinusQuantity = (productID) =>{
  const existingProduct = isExistingCartProduct(productID);
  if(existingProduct.quantity === 1 ){
      if(window.confirm("¿Desea eliminar el producto?")){
          removeProductFromCart(productID)
      }
      return
  }
  substractProductUnit(existingProduct.id);
}

const handleQueantity = (e) => {
  const {target} = e;

  if(target.classList.contains("up")){
    addUnitToProductCart(target.dataset.id);
  }
  else if(target.classList.contains("down")){
    handleMinusQuantity(target.dataset.id)
  }

  else if(target.classList.contains("delete-icon")){
    removeProductFromCart(target.dataset.id)
  }


  updateCartState();
}

const createProductData = (dataset)=>{
  const {id, title, price, thumbnail} = dataset;
  return {id, title, price, thumbnail};
}

const renderCart = ()=>{
  if(!cart.length){
      productsCart.innerHTML = `<p class="emply-mesg">No hay productos en el carrito</p>`;
      return
  }
  productsCart.innerHTML = cart.map(createCartProductTemplate).join("");
}

const updateCartState = ()=>{
  saveCart();
  renderCart();
  //showCartTotal();
  //disabledBtn(btnBuy);
  //disabledBtn(btnDelete);
  //renderCartBubble();
}

const addProduct = ({target}) =>{
  if(!target.classList.contains("btn-add")) return
  const product = createProductData(target.dataset);

  if(isExistingCartProduct(product.id)){
    addUnitToProductCart(product.id);
    showModelSuccess(`Agregaste una unidad al producto ${product.title}`);
  }
  else{
    createCartProduct(product);
    showModelSuccess(`Agregaste un producto al carrito: ${product.title} de $ ${product.price}`);
  }
  updateCartState();
}


// Otras funciones extras
const showModelSuccess = (msg) =>{
  modal.classList.add("active-modal");
  modal.textContent = msg;
      
  setTimeout(()=>{
      modal.classList.remove("active-modal");
      //cartLabelModal.addEventListener("click", toggleCart)
  }, 3000)
};








const init = async() =>{
  rederProducts();

  // Menu
  menuBtn.addEventListener("click", toggleMenu)
  barsMenu.addEventListener("click", closeOnClick);

  // Cart
  cartBtn.addEventListener("click", toggleCart)
  cartCross.addEventListener("click", toggleCart)
  productsCart.addEventListener("click", handleQueantity)
  

  // Productos
  productsContainer.addEventListener("click", addProduct);
  


  
  // Otros
  overlay.addEventListener("click", closeOnOverlayClick)
  window.addEventListener("scroll", closeOnScroll);
  window.addEventListener("DOMContentLoaded", renderCart);

  
  
}

init();