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
const sectionProducts = document.getElementById("products");

// Elementos del paginado
const pagesContainer = document.querySelector(".pages-container");
const previousPage = document.querySelector(".previous-page");
const nextPage = document.querySelector(".next-page");

const btnDeleteCategory = document.querySelector(".delete-category");

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

let currentPage = 0;
let allProductsTemplate = [];
let categoryProductsTemplates = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const saveCart = ()=>{
  localStorage.setItem('cart', JSON.stringify(cart));
}

const createCatgoryTemplate = (category)=>{
  const {slug, name, url} = category;
  return `
    <div class="container-category"> 
      <p class="category" data-category="${slug}" data-url="${url}">${name}</p>
      <p class="delete-category">
        <i class="fa-solid fa-xmark icon-delete-category"></i>
      </p>
    </div>`
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
  try{
    categoryProductsTemplates = [];
    const productsCategory = await getAllProductsByCategory(url)
    let arrayPages =  splitByPages(productsCategory);
    categoryProductsTemplates = renderTemplatePages(arrayPages);
    // currentPage =  0; REVISAR y Pensar
    productsContainer.innerHTML = categoryProductsTemplates[0];
    renderPageContainer(categoryProductsTemplates.length)
    pagesContainer.querySelectorAll(".number-page")[0].classList.add("active");
  }catch(error){
    console.log("Error al renderizar los elementos de la URL de la categoria --> " + error);
  }
}


const resetStylesCategories = () =>{
  categoriesContainer.querySelectorAll(".container-category")
    .forEach(container => {
      container.classList.remove("active-category")
      const category = container.querySelector(".category");
      category.classList.remove("active-category")
      const deleteCategory = container.querySelector(".delete-category");
      deleteCategory.style.display = "none";
    });
}


const renderProductsByCategory = ({target})=>{
  resetStylesCategories();
  currentPage = 0;
  if(target.classList.contains("container-category")){
    target.classList.add("active-category")
    let category = target.querySelector(".category");
    categoriesContainer.querySelectorAll(".container-category")
    .forEach(container => {
      const containerCategory = container.querySelector(".category");
      if(category.dataset.category == containerCategory.dataset.category){
        const deleteCategory = container.querySelector(".delete-category");
        deleteCategory.style.display = "flex";
      }
    });
    const urlCategory = category.dataset.url;
    renderProductsByCategoryUrl(urlCategory);
  }

  if(target.classList.contains("category")){
    const urlCategory = target.dataset.url;
    target.closest(".container-category").querySelector(".delete-category").style.display = "flex";
    target.closest(".container-category").classList.add("active-category")
    renderProductsByCategoryUrl(urlCategory);
  }
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

const createTemplatePage = (page) =>{
  return `<div class="page"><p class="number-page" data-page="${page}">${page}</p></div>`;
}

const createTemplatePages = (pages) =>{
  let templates = [];
  for(let i=1; i <= pages; i++){
    templates.push(createTemplatePage(i));
  }
  return templates.join('');
}

const checkActiveCategory = () =>{
  let allContainersCategory = categoriesContainer.querySelectorAll(".container-category");
  // Transformo el NodeList llamado allContainersCategory a un Array para poder usar el metodo some
  return Array.from(allContainersCategory)
    .some(container => container.classList.contains("active-category"));
}

const renderPreviousPage = () =>{
  if(currentPage >= 0 && (currentPage <= categoryProductsTemplates.length || currentPage <= allProductsTemplate.length)){
    // Primero resto uno a la pagina actual
    let previous = Number(currentPage) - 1;
    if(checkActiveCategory()){// si hay una catgeria seleccionada
      if(previous < categoryProductsTemplates.length && previous >= 0){
        currentPage = previous;
        updateProductContainer(categoryProductsTemplates[previous]);
        // Al target le asigno el valor del indice del arreglo de paginas
        updateColorPage({target: pagesContainer.querySelectorAll(".number-page")[previous]});
      }
    }
    if(!checkActiveCategory()){ // si no hay ninguna categoria seleccionada
      if(previous < allProductsTemplate.length && previous >= 0){
        currentPage = previous;
        updateProductContainer(allProductsTemplate[previous]);
        // Al target le asigno el valor del indice del arreglo de paginas
        updateColorPage({target: pagesContainer.querySelectorAll(".number-page")[previous]});
      }
    }
  }
}

const renderNextPage = () =>{
  if(currentPage >= 0 && (currentPage <= categoryProductsTemplates.length || currentPage <= allProductsTemplate.length)){
    let nextPage = Number(currentPage) + 1;
    if(checkActiveCategory()){
      if(nextPage < categoryProductsTemplates.length){
        currentPage = nextPage;
        updateProductContainer(categoryProductsTemplates[nextPage]);
        // Al target le asigno el valor del indice del arreglo de paginas
        updateColorPage({target: pagesContainer.querySelectorAll(".number-page")[nextPage]});
      }
    }
    if(!checkActiveCategory()){
      if(nextPage < allProductsTemplate.length){
        currentPage = nextPage;
        updateProductContainer(allProductsTemplate[nextPage]);
        // Al target le asigno el valor del indice del arreglo de paginas
        updateColorPage({target: pagesContainer.querySelectorAll(".number-page")[nextPage]});
      }
    }
  }
}

const renderPageContainer = (pages) =>{
  pagesContainer.innerHTML = createTemplatePages(pages);
}

const updateProductContainer = (arrayPage) =>{
  productsContainer.innerHTML = arrayPage;
  // Redirijo el scroll al inicio de la seccion de productos
  sectionProducts.scrollIntoView({ behavior: "smooth" });
}

const updateColorPage = ({target}) =>{
  pagesContainer.querySelectorAll(".number-page")
    .forEach(page => page.classList.remove("active"));
  target.classList.add("active");
}

const renderProductsOfPage = ({target}) =>{
  // Si no hay ninguna categoria seleccionada
  if(!checkActiveCategory()){
    if(!target.classList.contains("number-page")) return
    // Capturo el numero de la pagina y le resto uno para que conicida con el indice del array
    let pageToRender = target.dataset.page - 1;
    currentPage = pageToRender
    updateColorPage({target});
    updateProductContainer(allProductsTemplate[pageToRender]);
  }
  // Si hay una categoria seleccionada
  if(checkActiveCategory()){
    if(!target.classList.contains("number-page")) return
    // Capturo el numero de la pagina y le resto uno para que conicida con el indice del array
    let pageToRender = target.dataset.page - 1;
    currentPage = pageToRender
    updateColorPage({target});
    updateProductContainer(categoryProductsTemplates[pageToRender]);
  }
}

const splitByPages = (products) =>{
  if(products){
    let subdata = [];
    for(let i=0; i < products.length; i += 12){
      subdata.push(products.slice(i, i + 12));
    }
    return subdata;
  }
}

const renderTemplatePages = (arrayPages) =>{
  if(arrayPages){
    let templates = [];
    for(let i=0; i < arrayPages.length; i++){
      templates.push(arrayPages[i].map(product => createProductTemplate(product)).join(''));
    }
    return templates;
  }
}

const resetProductContainer = ({target}) =>{
  if(target.classList.contains("delete-category") || target.classList.contains("icon-delete-category")){
    // Muestro solo la primera pagina
    productsContainer.innerHTML = allProductsTemplate[0];
    // Reseteo el container de paginas
    renderPageContainer(allProductsTemplate.length)
    pagesContainer.querySelectorAll(".number-page")[0].classList.add("active");
  }
}

const rederProducts = async() =>{
  currentPage = 0;
  // Reseteo el array global de templates cada vez que se cargue la App
  allProductsTemplate = []  
  try {
    const products = await getAllProducts();
    // Deje este codigo para ejemplos de otras situaciones
    //producstCatalog.innerHTML = await structureData();
    //let templates = products.map(product => createProductTemplate(product)).join('')
    //productsContainer.innerHTML = templates;
    let arrayPages = splitByPages(products);
    // Cargo los templates de los productos en el array
    allProductsTemplate = renderTemplatePages(arrayPages);
    // Muestro solo la primera pagina
    productsContainer.innerHTML = allProductsTemplate[0];
    renderPageContainer(allProductsTemplate.length)
    pagesContainer.querySelectorAll(".number-page")[0].classList.add("active");
  }catch (error) {
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
  btnBuy.addEventListener("click", completeBuy)
  btnDelete.addEventListener("click", deleteCart)
  
  // Productos
  productsContainer.addEventListener("click", addProduct);

  // Categories
  categoriesContainer.addEventListener("click", renderProductsByCategory);
  categoriesContainer.addEventListener("click", resetProductContainer);

  // Paginado
  pagesContainer.addEventListener("click", renderProductsOfPage);
  previousPage.addEventListener("click", renderPreviousPage);
  nextPage.addEventListener("click", renderNextPage);

  // Otros
  overlay.addEventListener("click", closeOnOverlayClick)
  window.addEventListener("scroll", closeOnScroll);
  window.addEventListener("DOMContentLoaded", renderCart);

  // Formulario
  form.addEventListener("submit", handleSubmit);
  
  // Modal window
  closeModalWindow.addEventListener("click", closeModelWindow);
  //btnModalWindow.addEventListener("click", closeModelWindow);

  // Si lo activo no aparece el cartel de gracias por la compra o el aviso de carrito vacio con exito
  //btnContainerWindow.addEventListener("click", closeModelWindow);
  btnOkWindow.addEventListener("click", closeModelWindow);
  btnCancelWindow.addEventListener("click", closeModelWindow);

  window.addEventListener("click", () => console.log(`Current oage value --> ${currentPage}`));

  updateCartState();
}

init();