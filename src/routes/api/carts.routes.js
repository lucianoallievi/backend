import { Router } from "express";
import CartsManager from "../../managers/CartsManager.js";
import ProductsManager from "../../managers/ProductsManager.js";

import {
  ERROR_INVALID_ID,
  ERROR_NOT_FOUND_ID,
} from "../../constants/messages.constants.js";

const router = Router();
const cartsManager = new CartsManager();
const products = new ProductsManager();

const errorHandler = (res, message) => {
  if (message === ERROR_INVALID_ID)
    return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
  if (message === ERROR_NOT_FOUND_ID)
    return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
  return res.status(500).json({ status: false, message });
};

router.post("/", async (req, res) => {
  try {
    const cartCreated = await cartsManager.insertOne(req.body);
    res.status(201).json({ status: true, payload: cartCreated });
  } catch (error) {
    errorHandler(res, error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cartFound = await cartsManager.getOneById(req.params.id);
    res.status(200).json({ status: true, payload: cartFound });
  } catch (error) {
    errorHandler(res, error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const cartFound = await cartsManager.deleteOneById(req.params.id);
    res.status(200).json({ status: true, payload: cartFound });
  } catch (error) {
    errorHandler(res, error.message);
  }
});

router.delete("/:id/products", async (req, res) => {
  try {
    const cartFound = await cartsManager.emptyOneCartById(req.params.id);
    res.status(200).json({ status: true, payload: cartFound });
  } catch (error) {
    errorHandler(res, error.message);
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cartFound = await cartsManager.eraseCartProductById(cid, pid);
    res.status(200).json({ status: true, payload: cartFound });
  } catch (error) {
    errorHandler(res, error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const cartsFound = await cartsManager.getAll(req.query);
    res.status(200).json({ status: true, payload: cartsFound });
  } catch (error) {
    errorHandler(res, error.message);
  }
});
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cartFound = await cartsManager.addProduct(cid, pid, req.body);
    res.status(200).json({ status: true, payload: cartFound });
  } catch (error) {
    errorHandler(res, error.message);
  }
});

export default router;
