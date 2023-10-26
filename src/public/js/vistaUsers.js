const arrayBotonesToUser = document.getElementsByClassName('btn-toUser')
const arrayBotonesToPremium = document.getElementsByClassName('btn-toPremium')
const arrayBotonesToAdmin = document.getElementsByClassName('btn-toAdmin')

console.log(arrayBotonesToUser)
console.log(arrayBotonesToPremium)
console.log(arrayBotonesToAdmin)

for (let i=0; i < arrayBotonesToUser.length; i ++){
    arrayBotonesToUser[i].onclick = (e) => btnAccionToUser(e.target.dataset.id)
}

for (let i=0; i < arrayBotonesToPremium.length; i ++){
    arrayBotonesToPremium[i].onclick = (e) => btnAccionToPremium(e.target.dataset.id)
}

for (let i=0; i < arrayBotonesToAdmin.length; i ++){
    arrayBotonesToAdmin[i].onclick = (e) => btnAccionToAdmin(e.target.dataset.id)
}


const btnAccionToAdmin = async(id) =>{
    const data = {profile: "admin"}
    const result = await updateUser(id, data)
    if (result.status == 200) location.reload()
}

const btnAccionToPremium = async(id) =>{
    const data = {profile: "premium"}
    const result = await updateUser(id, data)
    if (result.status == 200) location.reload()
}

const btnAccionToUser = async(id) =>{
    const data = {profile: "user"}
    const result = await updateUser(id, data)
    if (result.status == 200) location.reload()

}

const updateUser = async(id, data) =>{
    
    const resultado = await fetch (`http://localhost:8080/api/users/${id}`, { 
                                    method: 'put',
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(data)    
                                    })
    
    return resultado

    
}