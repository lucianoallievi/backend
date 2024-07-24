import { Router } from "express";
import ProductsManager from "../../managers/ProductsManager.js";

import {
  ERROR_INVALID_ID,
  ERROR_NOT_FOUND_ID,
} from "../../constants/messages.constants.js";

const errorHandler = (res, message) => {
  if (message === ERROR_INVALID_ID)
    return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
  if (message === ERROR_NOT_FOUND_ID)
    return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
  return res.status(500).json({ status: false, message });
};

const router = Router();
const productsManager = new ProductsManager();

router.get("/", async (req, res) => {
  try {
    const productsFound = await productsManager.getAll(req.query);
    res.status(200).json({ status: true, payload: productsFound });
  } catch (error) {
    errorHandler(res, error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productFound = await productsManager.getOneByID(req.params.id);
    res.status(200).json({ status: true, payload: productFound });
  } catch (error) {
    errorHandler(res, error.message);
  }

  res.send();
});

router.post("/", async (req, res) => {
  try {
    const productCreated = await productsManager.insertOne(req.body);
    res.status(201).json({ status: true, payload: productCreated });
  } catch (error) {
    errorHandler(res, error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const productUpdated = await productsManager.updateOneById(
      req.params.id,
      req.body
    );
    res.status(200).json({ status: true, payload: productUpdated });
  } catch (error) {
    errorHandler(res, error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productDeleted = await productsManager.deleteOneById(req.params.id);

    res.status(200).json({ status: true, payload: productDeleted });
  } catch (error) {
    errorHandler(res, error.message);
  }
});

export default router;
