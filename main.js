// URL API
const UrlAllProducts = 'https://dummyjson.com/products?limit=0'

// Elementos del menu
const menuBtn = document.querySelector('.menu-label');
const barsMenu = document.querySelector('.navbar-list');

// Label cart
const cartBtn = document.querySelector(".cart-label");
const bubble = document.querySelector('.cart-bubble');

// Elementos del carrito
const cartMenu = document.querySelector(".cart");
const cartCross = document.querySelector('.cart-cross');
const cartBody = document.querySelector(".cart-body");
const cartMessage = document.querySelector('.cart-message');
const productsCart  = document.querySelector('.cart-container');
const divider = document.querySelector('.divider');
const cartTotal  = document.querySelector('.cart-total');
const total = document.querySelector(".total");
const btnBuy  = document.querySelector('.btn-buy');
const btnDelete  = document.querySelector('.btn-delete');
const deleteIcon = document.querySelector(".delete-icon");
const componentsContainer = document.querySelector(".components-container");



// Elementos de los productos
const btnAdd = document.querySelector('.btn-add');
const productsContainer = document.querySelector(".products-container");

// Otros elementos
const modal = document.querySelector('.add-modal');
const overlay = document.querySelector('.overlay');
const cartLabelModal = document.querySelector(".cart-label-modal");

let productList = [];
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
    <!-- <p>${id}</p> -->
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
    productList = [...products];
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

const getTotalCart = ()=>{
  return cart.reduce((acc, product) => {
    return (acc = acc + Number(product.price) * product.quantity)
  }, 0);
}

const showCartTotal = ()=>{
  total.innerHTML = `$ ${getTotalCart().toFixed(2)}`;
}

const renderCartBubble = () => {
  bubble.textContent = cart.reduce(
      (acc, value) => (acc = acc + value.quantity), 0
  );
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

// Funciones para el carrrito
const createCartProductTemplate = (item)=>{
  const {id, title, price, thumbnail, quantity} = item;
  return `
    <div class="cart-item">
        <img src=${thumbnail} alt="NFT del carrito">
        <div class="item-info">
            <h3 class="item-title">${title}</h3>
            <p class="item-bid">Unit price</p>
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
    componentsContainer.classList.add("hidden");
    cartBody.classList.add("flex-column-center");

    if(!cartMessage.classList.contains("hidden")){
      cartMessage.classList.remove("hidden");
    }
    cartMessage.classList.remove("hidden");
    cartMessage.textContent = "No tienes productos en tu carrito.";
    return
  }
  else{
    cartBody.classList.remove("flex-column-center");
    if(componentsContainer.classList.contains("hidden")){
      componentsContainer.classList.remove("hidden");
      cartMessage.classList.add("hidden");
    }
  }
  productsCart.innerHTML = cart.map(createCartProductTemplate).join("");
}

const resetCart = () =>{
  cart = [];
  updateCartState();
}

const completeBtnAction = (confirmMsg, successMsg) =>{
  if(!cart.length) return
  if(window.confirm(confirmMsg)){
      resetCart()
      alert(successMsg)
  }
}

const completeBuy = () =>{
  completeBtnAction("¿Desea finalizar la compra?", "¡Gracias por su compra!");
}

const deleteCart = () =>{
  completeBtnAction("¿Desea vaciar el carrito?", "Carrito vacio!");
}

const updateCartState = ()=>{
  saveCart();
  renderCart();
  showCartTotal();
  //disabledBtn(btnBuy);
  //disabledBtn(btnDelete);
  renderCartBubble();
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

  btnBuy.addEventListener("click", completeBuy)
  btnDelete.addEventListener("click", deleteCart)

  
  updateCartState();
}

init();