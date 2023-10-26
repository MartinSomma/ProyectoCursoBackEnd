import { ProdcutService } from '../services/product.service.js' 
import { CartService } from '../services/cart.services.js';
import { UserService } from '../services/user.service.js';



export const viewCartByIDController = async (req, res) => {
  try {
    const id = req.params.cid;
    const result = await CartService.getByIdSP(id);
    res.status(200).render("carrito", { result });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
}

export const resetPasswordController = (req, res) => {
  res.render("reset-password")
}

export const viewLoginController = (req, res) => {
  res.render("login");
}

export const viewRegistroController = (req, res) => {
  res.render("registro");
}

export const viewProductsController = async (req, res) => {
    try {
        const data = await ProdcutService.getAllPaginate(req);
        res.status(200).render("index", {
                                data: data,
                                username: req.session.passport.user.username,
                                rol: req.session.passport.user.profile,
    })
    } catch (err) {
        res.status(404).json({ status: "error", error: err.message });
    }
}

export const viewRealTimeProductsController = (req,res)=>{
    res.render('realtimeproducts')
}

export const viewUsersController = async(req, res) => {

    const users = await UserService.find()
  res.render('users', {users})
}