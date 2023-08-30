export default class UserDTO {
    constructor (user) {
        this.info = `Username: ${user.username}, UserID: ${user._id}, cartID: ${user.cart}`
    }
}