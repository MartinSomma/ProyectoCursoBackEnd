console.log("nuevoooooo js")
const form = document.querySelector('#formulario') 
const inputs = document.querySelectorAll("#formulario input ")

console.log(form)

formulario.onsubmit = (event) =>{
    event.preventDefault()
    console.log(inputs[0].value)
    console.log(inputs[1].value)
}

const socket = io()

socket.on('info', data => console.log(data) )


