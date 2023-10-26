export const generateUserErrorInfo = (user) => {
    return `
    Uno o mas parámetros estan incompletos o no son válidos.
    Lista de properties obligotorios:
        - first_name: Must be a string. (${user.first_name})
        - last_name: Must be a string. (${user.last_name})
        - email: Must be a string. (${user.email})
    `
}

export const generateProductErrorInfo = (product) => {
    return `
    Uno o mas parámetros estan incompletos o no son válidos.
    Lista de properties obligotorios:
        - product.title: nombre del Product, string. ${product.title}
        - product.description: descripcion, string. ${product.description}
        - product.price: precio, numerico. ${product.price}
        - product.code: Codigo, alfanumerico. ${product.code}
        - product.status: Estado, booleano. ${product.status}
        - product.stock: stock, nmumerico. ${product.stock}
        - product.category: category, string. ${product.category}
    `
}

export const generateDataErrorInfo = (id) => {
    return `
    id not found. (${id})
    `
}



