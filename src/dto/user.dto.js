export default class UserDTO {
    constructor (user) {
        
        this.info = `Username: ${user.email}, UserID: ${user._id}, cartID: ${user.cart}, profile: ${user.profile}`
    }
}
