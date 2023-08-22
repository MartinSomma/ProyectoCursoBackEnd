import { getCarritoService } from "../services/cart.services.js";
import { getProductsService } from '../services/product.services.js'


export const viewCartByIDController = async (req, res) => {
  try {
    const id = req.params.cid;
    const result = await getCarritoService(id);
    console.log(result.products[0].product.code);
    res.status(200).render("carrito", { result });
    //res.status(200).json({ status: 'success', payload: result })
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
}

export const viewLoginController = (req, res) => {
  res.render("login");
}

export const viewRegistroController = (req, res) => {
  res.render("registro");
}

export const viewProductsController = async (req, res) => {
    try {
        const data = await getProductsService(req, res);

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