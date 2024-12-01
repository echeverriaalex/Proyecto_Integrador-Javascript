//import './style.css'
import './assets/styles.css'
import './assets/mediaqueries.css'
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


const getAllProducts = async(url)=>{
  let result = await fetch(url)
    .then(res => {
        if(!res.ok){
          console.log('API Error');
          return
        }
        return res.json()
      }
    )
    .then(data => {
      return data.products;
    })
  
  console.log("result dentro de la funcion --> " + result);
  
}


/*
const result = await fetch(UrlAllProducts)
.then(res => {
  if(!res.ok){
    console.log('API Error');
  }
    return res.json()
  }
)
.then(data => {
  return data.products;
})
*/

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
      <button class="btn-cart">Agregar a carrito</button>
    </div>
  </div>`
}

/*
const rederProducts = () =>{
  return result.map(product =>{
      return createProductTemplate(product)
    }
  )
}
*/

const rederProducts = (result) =>{
  return result.map(createProductTemplate).join('')
}


// console.log(rederProducts());





const init = () =>{
  let productList = getAllProducts(UrlAllProducts)
  
  console.log("Mostrando productos --> " + productList);
  



  //producstCatalog.innerHTML = rederProducts(productList);



  

}



init();