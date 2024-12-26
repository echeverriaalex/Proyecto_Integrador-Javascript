// URLs API
const UrlAllProducts = "https://dummyjson.com/products?limit=0";
const UrlAllCategories = "https://dummyjson.com/products/categories";

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
const categoriesContainer = document.querySelector(".categories-container");

// Otros elementos
const modal = document.querySelector('.add-modal');
const overlay = document.querySelector('.overlay');
const cartLabelModal = document.querySelector(".cart-label-modal");
const form = document.querySelector('.contact-form');

const nameMessage = document.querySelector("#name-message");
const lastnameMessage = document.querySelector("#lastname-message");
const emailMessage = document.querySelector("#email-message");
const phoneMessage = document.querySelector("#phone-message");
//const textMessage = document.querySelector("#text-message");

// Modal window
const modalWindow = document.getElementById("modal");
const closeModalWindow = document.querySelector(".close-modal");
const messageModalWindow = document.querySelector(".message-modal");
//const btnModalWindow = document.querySelector(".btn-modal");
const btnContainerWindow = document.querySelector(".btn-container");
const btnOkWindow = document.querySelector(".btn-ok");
const btnCancelWindow = document.querySelector(".btn-cancel");


let productList = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const saveCart = ()=>{
  localStorage.setItem('cart', JSON.stringify(cart));
}

const createCatgoryTemplate = (category)=>{
  const {slug, name, url} = category;
  return `<p class="category" data-category="${slug}" data-url="${url}">${name}</p>`
}

const getAllCategories = async()=>{
  try{
    const response = await fetch(UrlAllCategories)
    const data = await response.json()
    return data;
  }
  catch(err){
    console.log("Se ha producido un error desconocido al traer las categorias -> " + err);
  }
}

const rederCategories = async() =>{
  try {
    const categories = await getAllCategories();
    let templates = categories.map(category => createCatgoryTemplate(category)).join('');
    categoriesContainer.innerHTML = templates;    
  } catch (error) {
    console.log("Error al renderizar las categories" + error);
  }
}

const getAllProductsByCategory = async(url)=>{
  try{
    const response = await fetch(url)
    const data = await response.json()
    return data.products;
  }
  catch(err){
    console.log("Se ha producido un error desconocido al traer las categorias -> " + err);
  }
}

const renderProductsByCategoryUrl = async(url) =>{
  try {
    const productsCategory = await getAllProductsByCategory(url)
    //console.log("tengo los de la categoria");    
    let templates = productsCategory.map(product => createProductTemplate(product)).join('')
    productsContainer.innerHTML = templates;    
  } catch (error) {
    console.log("Error al renderizar los elementos de la URL de la categoria --> " + error);
  }
}

const renderProductsByCategory = ({target})=>{
  if(!target.classList.contains("category")) return
  /*  Traigo todos los elementos del container, y por cada uno que tenga la clase categoria
    le remuevo la clase active-category si la tiene */
  categoriesContainer.querySelectorAll(".category")
    .forEach(category => category.classList.remove("active-category"));

  // Agrego la clase active-category al elemento que se le hizo click
  target.classList.add("active-category");
  const urlCategory = target.dataset.url;
  renderProductsByCategoryUrl(urlCategory);
}

const createProductTemplate = (product)=>{
  const {id, title, description, price, stock, tags, images, thumbnail} = product
  let tagsTemplate = tags.map(tag => `<p class="tag-product">${tag}</p>`).join('')

  return `
  <div class="product-card">
    <div class="image-container-product">
      <img class="product-image" src="${images[0]}" alt="${title}">
      <!-- <img class="product-image" src="${thumbnail}" alt="Imagen del producto"> -->
    </div>
    <div class="tag-container">
      ${tagsTemplate}
    </div>
    <h2 class="product-title">${title}</h2>
    <p class="product-description">${description}</p>
    <p class="product-price">$ ${price}</p>
    <p>Stock: <span class="stock">${stock}</span></p>
    <div class="button-container">
      <button 
        class="btn-add"
        data-id="${id}"
        data-title="${title}"
        data-price="${price}"
        data-thumbnail="${thumbnail}
        data-stock="${stock}"
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

/*
const completeBtnActionModel = (msg) =>{
  resetCart()
  //showModelMessage("¡Gracias por su compra!");
    setMesaageModalWindow(msg);
    showModelWindow();
}
*/

const completeBuy = () =>{
  //completeBtnAction("¿Desea finalizar la compra?", "¡Gracias por su compra!");
  //showModelMessage("¿Desea finalizar la compra?");
  openModelWindow("¿Desea finalizar la compra?", true);
  //btnOkWindow.addEventListener("click", completeBtnActionModel("¡Gracias por su compra!"));

  btnOkWindow.addEventListener("click", ()=>{
    resetCart()
    openModelWindow("¡Gracias por su compra!", false);
  });
  btnCancelWindow.addEventListener("click", closeModelWindow);
}

const deleteCart = () =>{
  //completeBtnAction("¿Desea vaciar el carrito?", "Carrito vacio!");
  openModelWindow("¿Desea vaciar el carrito?", true);
  //btnOkWindow.addEventListener("click", completeBtnActionModel("Se vació el carrito con éxito."));
  btnOkWindow.addEventListener("click", ()=>{
    resetCart()
    openModelWindow("Se vació el carrito con éxito.", false);
  });
  btnCancelWindow.addEventListener("click", closeModelWindow);
}

const updateCartState = ()=>{
  saveCart();
  renderCart();
  showCartTotal();
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

const isValidPhone = (phone) => {
  //const regex = /^\d{7}$/
  const regex = /^\(\d{3}\)\s\d{3}-\d{4}$/;

  //console.log("Phone --> " + phone);
  
  return regex.test(phone);
};

const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
  return regex.test(email);
};

const isValidText = (text)=>{
  const regex = /^[a-zA-Z]+$/; // evaluo que solo sean letras
  return text.length
    ? regex.test(text)
    : false;
}

const handleSubmit = (e) =>{
  e.preventDefault();
  const name = document.querySelector("#name").value.trim();
  const lastName = document.querySelector("#lastname").value.trim();
  const email = document.querySelector("#email").value.trim();
  const phone = document.querySelector("#phone").value.trim();
  
  if(!isValidText(name)){
    nameMessage.classList.remove("hidden");
    nameMessage.textContent = "Este campo es obligatorio.";
    //return
  }
  else{
    nameMessage.classList.add("hidden");
    nameMessage.textContent = "";
  }
  if(!isValidText(lastName)){
    lastnameMessage.classList.remove("hidden");
    lastnameMessage.textContent = "Este campo es obligatorio.";
    //return
  }
  else{
    lastnameMessage.classList.add("hidden");
    lastnameMessage.textContent = "";
  }
  if(!isValidEmail(email)){
    //console.log(email);
    emailMessage.classList.remove("hidden");
    emailMessage.textContent = "E-mail no válido.";
    //return
  }else{
    emailMessage.classList.add("hidden");
    emailMessage.textContent = "";
  }
  if(!isValidPhone(phone)){
    phoneMessage.classList.remove("hidden");
    phoneMessage.textContent = "Teléfono no válido.Ejemplo: (123) 456-7890";
    //return
  }
  else{
    phoneMessage.classList.add("hidden");
    phoneMessage.textContent = "";
  }
  //resetCart();

  if(isValidText(name) 
    && isValidText(lastName) 
    && isValidEmail(email) 
    && isValidPhone(phone) ){
      openModelWindow("¡Gracias! Te contactaremos pronto.", false);
    }
}

const openModelWindow = (msg, configSecondBtn) =>{
  modalWindow.style.display = "flex";
  configModelWindow(msg, configSecondBtn);
}

const showModelMessage = (msg) =>{
  messageModalWindow.textContent = msg;
  modalWindow.style.display = "flex";
}

const configModelWindow = (msg, configSecondBtn) =>{
  messageModalWindow.textContent = msg;
  configSecondBtn
  ? btnContainerWindow.style.display = "flex"
  : btnContainerWindow.style.display = "none";
}

const setMesaageModalWindow = (msg) =>{
  messageModalWindow.textContent = msg;
  modalWindow.style.display = "flex";
}

const closeModelWindow = ({target}) =>{
  if(target.classList.contains("btn-ok") 
    || target.classList.contains("close-modal")
    || target.classList.contains("btn-cancel")){
    modalWindow.style.display = "none";
  }
}

const init = async() =>{
  rederCategories();
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
  categoriesContainer.addEventListener("click", renderProductsByCategory);

  // Formulario
  form.addEventListener("submit", handleSubmit);
  
  // Modal window
  closeModalWindow.addEventListener("click", closeModelWindow);
  //btnModalWindow.addEventListener("click", closeModelWindow);

  // Si lo activo no aparece el cartel de gracias por la compra o el aviso de carrito vacio con exito
  //btnContainerWindow.addEventListener("click", closeModelWindow);
  btnOkWindow.addEventListener("click", closeModelWindow);
  btnCancelWindow.addEventListener("click", closeModelWindow);

  updateCartState();
}

init();