
const arrBtns = document.getElementsByClassName("btn")
const IdCarritos = document.querySelector(".seccionIdCarritos")

for (let i=0; i < arrBtns.length; i ++){
    arrBtns[i].onclick = (e) => btnAccion(e.target.dataset.id)
}

function btnAccion(id){
    const cartList = document.getElementById("idcarrito")
    

    fetch(`http://localhost:8080/api/carrito/${cartList.value}/product/${id}`, {method: "POST"})
    .then((resp) => resp.json())
    .then ((data) => {
        if (data.status != 'success') {
            alert(`${data.error}`)    
        } else {
            alert(`prod id ${id} agregado al carrito ${cartList.value}.`)
        }
        
    })
    .catch ( (error) => {
        console.log("No se pudo conectar, error: " + error)})


}


const mostrarCarrito = (data) => {
    
    let str = `
        
            <label for="lang" class="col-form-label" >Add2Cart #:</label>
            <select name="IDcarrito" id="idcarrito" >
        `
    
    for (let i=0; i< data.payload.length; i++){
        str += `<option value="${data.payload[i]._id}">${data.payload[i]._id}</option>\r\n`
        }


    str += `
            </select>    
        
        `

    IdCarritos.innerHTML = str

    

}
fetch('http://localhost:8080/api/carrito')
    .then((resp) => resp.json())
    .then ((data) => mostrarCarrito(data))
    .catch ( (error) => {
        console.log("No se pudo conectar, error: " + error)})