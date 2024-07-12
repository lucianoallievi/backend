import { Router } from "express";
import ProductManager from "../../managers/ProductManager.js";

import {
  ERROR_INVALID_ID,
  ERROR_NOT_FOUND_ID,
} from "../../constants/messages.constants.js";

const errorHandler = (res, message) => {
  if (message === ERROR_INVALID_ID)
    return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
  if (message === ERROR_NOT_FOUND_ID)
    return res.status(400).json({ status: false, message: ERROR_NOT_FOUND_ID });
  return res.status(500).json({ status: false, message });
};

const router = Router();
const productsManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const productsFound = await productsManager.getAll(req.query);
    res.status(200).json({ status: true, payload: productsFound });
  } catch (error) {
    errorHandler(res, error.message);
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productFound = await productsManager.getOneByID(req.params.pid);
    res.status(200).json({ status: true, payload: productFound });
  } catch (error) {
    errorHandler(res, error.message);
  }

  res.send();
});

/*
router.post("/", async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  if (!(title && description && code && price && stock && category)) {
    res.send("falta campos obligatorios");
  } else {
    const newProduct = { status: true, ...req.body };

    res.send(await products.createProduct(newProduct));
  }
});
*/
export default router;
