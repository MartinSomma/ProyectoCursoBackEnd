


const enviarDatos = () =>{
    const user = document.getElementById("inputUser")
    const newPassword = document.getElementById("inputNewPassword")

    const str = window.location.href
    const token = (str.substring(str.length - 20))

    const datos = {user: user.value, password: newPassword.value, token: token}

    fetch('http://localhost:8080/api/users/new-password', {
        method: "POST",
        body: JSON.stringify(datos),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
    .then(response => response.json()) 
    .then(json => {
        alert("Contraseña modificada")
        window.location.href = "/login"
    })
    .catch(err => alert("Error al actualizar"))
}

const btn = document.getElementById("boton")
btn.addEventListener("click", enviarDatos)

