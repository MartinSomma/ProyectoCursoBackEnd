import fs from 'fs'
import { pid } from 'process';

export default class ProductManager {
  #products;
  #error;
  #file;
  #format;
  constructor(filename) {
    this.#products = [];
    this.#error = undefined;
    this.#file = filename;
    this.#format= 'utf-8';
  }

  getProducts = async() => {
    if (fs.existsSync(this.#file)){
      this.#products = JSON.parse(await fs.promises.readFile(this.#file, this.#format))       
    } else {
      this.#products = []
      console.log('no se pudo abrir el archivo con la lista de productos')
    }
    return this.#products 
  }

  getProductById = async(id) => {
    await this.getProducts()
    const prod = this.#products.find((item) => item.id == id);
    if (!prod) return undefined;
    return prod;
  };

  #generateId = () =>
    this.#products.length === 0
      ? 1
      : this.#products[this.#products.length - 1].id + 1;

      #validateProduct = (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
          this.#error = `[${title}]: campos incompletos`;
        } else {
          this.#products.find( (item) => item.code === code)
            ? (this.#error = `[${title}]: el code ya existe`)
            : (this.#error = undefined);
          }
      };

  
  addProduct = async(title, description, price, thumbnail, code, stock,status,category) => {
    const prods = await this.getProducts()
    this.#validateProduct(title, description, price, thumbnail, code, stock);
    (this.#error === undefined)
    ?(prods.push({
      id: this.#generateId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category}))
      : console.log(this.#error)
    await fs.promises.writeFile(this.#file, JSON.stringify(prods, null, '\t'))
    return(this.#error)  
  }

  updateProduct = async ( id, data) => {
    const prods = await this.getProducts()
    const pIndex = prods.findIndex(item => item.id == id)
    
    if (pIndex) {
      prods[pIndex] = {...prods[pIndex], ...data}
      await fs.promises.writeFile(this.#file, JSON.stringify(prods, null, '\t'))
      return true
    } else {
      return false
    }
  }

  deleteProductoByID = async (id) => {

    let prods = await this.getProducts()

    const pIndex = prods.findIndex(item => item.id == id)

    if (pIndex >=0 ) {
      prods = prods.filter(item => item.id != id)
      await fs.promises.writeFile(this.#file, JSON.stringify(prods, null, '\t'))
      return(true)
    } else {
      return(false)
    }


    
    
  }

}

//export const manager = new ProductManager('./products.json');

/*
//console.log(await manager.getProducts())


//Protocolo de prueba
await manager.addProduct(
  "Picadora",
  "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/373/205/products/mini-picadora-oster-fpstfp3340-11-c0907aea4590b3b0a316835059618704-640-0.webp",
  13400,
  "buscalo en la web",
  6000,
  12
); //si el archivo no existe lo agrega, sino da codigo existente

await manager.addProduct(
    "Picadora 2",
    "picadora oster fb3340",
    26000,
    "http://buscalo en la web/la imagen",
    5000,
    12
  ); //si el archivo no existe lo agrega, sino da codigo existente


  await manager.addProduct(
  "taladro",
  "taladro con percutor",
  22000,
  "http://buscar en intrnet/la imagena",
  2020,
  100
); //si el archivo no existe lo agrega, sino da codigo existente

await manager.addProduct(
  "Picadora",
  "picadora oster fb3340",
  13400,
  "buscalo en la web",
  5000,
  12
); //tiene q devolver q el codigo ya existe

await manager.addProduct(
  "destornillador electrico",
  "destonillador electrico",
  10000
); //tiene q devolver 'campos incompletos'

console.log(await manager.getProductById(3)) //devuelve producto con id=2
console.log(await manager.getProductById(9)) //devuelve 'not found'


*/