import { Router } from "express";
import ProductsManager from "../../data/fs/products.js";

const router = Router();
const products = new ProductsManager();

router.get("/", async (req, res) => {
  const allProducts = await products.getProducts();
  res.send(allProducts);
});
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;

  res.send(await products.getProductByID(pid));
});

router.post("/", async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  if (!(title && description && code && price && stock && category)) {
    res.send("falta campos obligatorios");
  } else {
    const newProduct = { status: true, ...req.body };

    res.send(await products.createProduct(newProduct));
  }
});

export default router;
