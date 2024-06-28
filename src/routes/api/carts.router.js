import { Router } from "express";
import CartManager from "../../data/fs/carts.js";
import ProductsManager from "../../data/fs/products.js";

const router = Router();
const carts = new CartManager();
const products = new ProductsManager();

router.post("/", (req, resp) => {
  const products = req.body.products ? req.body.products : { products: [] };
  const cart = carts.createCart(products);
  resp.send(cart);
});
router.get("/:cid", async (req, resp) => {
  const cid = req.params.cid;
  const cart = await carts.getCartById(cid);
  const allProducts = await products.getProducts();
  const productsInCart = [];
  cart.products.map((each) => {
    allProducts.map((eachProduct) => {
      if (each.id == eachProduct.id)
        productsInCart.push({ quantity: each.quantity, ...eachProduct });
    });
  });
  resp.send({ id: cart.id, products: productsInCart });
});
router.post("/:cid/products/:pid", async (req, resp) => {
  const cart = await carts.getCartById(req.params.cid);
  let newCart = {};
  const product = await products.getProductByID(req.params.pid);
  //si no existe carrito
  if (!cart) {
    resp.send("Cart no disponible");
    return false;
  }
  //si no existe producto
  if (!product) {
    resp.send("Producto no disponible");
    return false;
  }
  //si es un producto ya existente en el carrito, sumo uno valor a la cantidad
  if (cart.products.find((each) => each.id == product.id)) {
    cart.products = cart.products.map((each) => {
      if ((each.id = product.id)) {
        console.log(each.id, " ", product.id);
        return { id: each.id, quantity: each.quantity + 1 };
      } else {
        return each;
      }
    });
  }
  //si el producto no existía en el carrito
  else {
    cart.products.push({ id: product.id, quantity: 1 });
  }

  carts.updateCarts(cart);
  resp.send(cart);
});

export default router;
