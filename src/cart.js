import fs from 'fs'

export default class Carrito {

    #file
    #format
    #cart
    constructor(filename){
        this.#file=filename
        this.#format='utf-8'
        this.#cart=[]

        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, JSON.stringify([], null, '\t') )
        }
    }

    #generateId = () =>
    this.#cart.length === 0
      ? 1
      : this.#cart[this.#cart.length - 1].id + 1;

    #getCart = async() => {
        this.#cart = JSON.parse(await fs.promises.readFile(this.#file, this.#format))
        return this.#cart
    }

    newCart = async () => {
        const carro = await this.#getCart()
        const cartID = this.#generateId()
        carro.push({id: cartID, prodcuts: []})
        await fs.promises.writeFile(this.#file, JSON.stringify(carro, null, '\t'))
        return cartID
    }

    getCartId = async(id) => {
        await this.#getCart()
        const cartItem = this.#cart.find((item) => item.id == id);
        if (!cartItem) return undefined;
        return cartItem;
    }

    addProduct2Cart = async (cartID, prodID) =>{
        await this.#getCart()

        const cartIndex = this.#cart.findIndex(item => item.id == cartID)
        if (cartIndex<0) return undefined

        const prodIndex = ((this.#cart[cartIndex].prodcuts.findIndex((item) => item.id == prodID)))

        if (prodIndex>=0) {
            this.#cart[cartIndex].prodcuts[prodIndex].qty++
        } else {
            this.#cart[cartIndex].prodcuts.push({id: prodID, qty: 1 })
        }
        await fs.promises.writeFile(this.#file, JSON.stringify(this.#cart, null, '\t'))
        return this.#cart
    }

}


