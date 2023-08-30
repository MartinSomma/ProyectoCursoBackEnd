const form = document.querySelector('#formulario') 
const inputs = document.querySelectorAll("#formulario input")

const espacioTabla = document.getElementById("prodTabla")
const tabla = document.createElement("table")
tabla.className = 'table table-striped'



let btnEliminar = document.querySelectorAll("#btnEliminar")


formulario.onsubmit = (event) =>{
    event.preventDefault()
    const prod = {
        title: inputs[0].value,
        description: inputs[1].value,
        price: parseFloat(inputs[2].value),
        thumbnail: inputs[3].value,
        code: (inputs[4].value),
        stock: parseInt(inputs[5].value),
        category: inputs[6].value,
        status: Boolean(inputs[7].value),
    }
    fetch('/api/products', {
        method: 'post',
        body: JSON.stringify(prod),
        headers: {'Content-Type': 'application/json'
        },
    })
    .then( result => result.json()
     )
    .then (result => {
        console.log(result)
        if (result.status === 'error') alert(`Error: ${result.message}`) 
        else alert ('Todo Salio ok!')
    })
    .catch( (error) => console.log(error) )
}

const socket = io()

socket.on('info', data => {
    tabla.innerHTML = ""
    tabla.innerHTML = `
                        <tr>
                            <th>ID</th>
                            <th>codigo</th>
                            <th>title</th>
                            <th>Precio</th>
                            <th>stock</th>
                            <th></th>
                        </tr>`;

    for (ele of data) {
        tabla.innerHTML +=  `
        <tr class="table-light">
            <td>${ele._id}</td>
            <td>${ele.code}</td>
            <td>${ele.title}</td>
            <td>${ele.price}</td>
            <td>${ele.stock}</td>
            <td> <button id="btnEliminar" data-id=${ele._id}>Eliminar</button></td>
        </tr>`;
    }
    espacioTabla.appendChild(tabla)
    btnEliminar = document.querySelectorAll("#btnEliminar")

    for(i=0; i<btnEliminar.length; i++){
        btnEliminar[i].onclick = (e) => {
            //console.log(e.target.dataset.id)
            fetch(`/api/products/${e.target.dataset.id}`, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'
                },
            })
            .then( result => result.json())
            .then (result =>{alert("resultado: " + result.message)})
            .catch ( (err) => { console.log(err) } )
            
        }
    }
} )






