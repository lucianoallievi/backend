import cartModel from "../models/cart.model.js";
import mongoDB from "../config/mongoose.config.js";
import { Types } from "mongoose";
import {
  ERROR_DELETE_DOCUMENT,
  ERROR_INVALID_ID,
  ERROR_NOT_FOUND_ID,
} from "../constants/messages.constants.js";
import mongoose from "mongoose";

export default class CartsManager {
  #cartModel;

  constructor() {
    this.#cartModel = cartModel;
  }

  insertOne = async (data) => {
    try {
      const newCart = new cartModel();
      data.map((each) => {
        newCart.products.push({
          product: each.productId,
          amount: 1,
        });
      });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getAll = async (paramFilters) => {
    try {
      const sort = {
        asc: { name: 1 },
        desc: { name: -1 },
      };
      const paginationOptions = {
        limit: paramFilters?.limit ?? 5,
        page: paramFilters?.page ?? 1,
        sort: sort[paramFilters?.sort] ?? {},
        populate: "products.product",
        lean: true,
      };
      const cartsFound = await this.#cartModel.paginate({}, paginationOptions);
      return cartsFound;
      return;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getOneById = async (id) => {
    try {
      if (!mongoDB.isValidID(id)) {
        throw new Error(ERROR_INVALID_ID);
      }

      const cartFound = await this.#cartModel
        .findById(id)
        .populate("products.product")
        .lean();

      if (!cartFound) throw new Error(ERROR_NOT_FOUND_ID);

      return cartFound;
    } catch (error) {
      throw new Error(error);
    }
  };

  deleteOneById = async (id) => {
    try {
      if (!mongoDB.isValidID(id)) {
        throw new Error(ERROR_INVALID_ID);
      }

      const cartFound = await this.#cartModel.findById(id);
      if (!cartFound) {
        throw new Error(ERROR_NOT_FOUND_ID);
      }
      await this.#cartModel.findByIdAndDelete(id);
      return cartFound;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  addProduct = async (cid, pid, data) => {
    try {
      if (!mongoDB.isValidID(cid)) {
        throw new Error(ERROR_INVALID_ID);
      }
      const cartFound = await this.#cartModel.findById(cid);

      if (!cartFound) throw new Error(ERROR_NOT_FOUND_ID);
      const index = cartFound.products.findIndex(
        (product) => product.product == pid
      );
      if (index > -1) {
        cartFound.products[index].amount += data.amount;
      } else {
        cartFound.products.push({ product: pid, amount: data.amount });
      }

      await cartFound.save();

      return cartFound;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  emptyOneCartById = async (id) => {
    try {
      if (!mongoDB.isValidID(id)) {
        throw new Error(ERROR_INVALID_ID);
      }

      const cartFound = await this.#cartModel.findById(id);
      if (!cartFound) {
        throw new Error(ERROR_NOT_FOUND_ID);
      }

      cartFound.products = [];
      await cartFound.save();
      return cartFound;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  eraseCartProductById = async (cid, pid) => {
    try {
      if (!mongoDB.isValidID(cid)) {
        throw new Error(ERROR_INVALID_ID);
      }

      const cartFound = await this.#cartModel.findById(cid);
      if (!cartFound) {
        throw new Error(ERROR_NOT_FOUND_ID);
      }

      const index = cartFound.products.findIndex(
        (product) => product.product_id == pid
      );
      if (index > -1) {
        const newProducts = [];

        cartFound.products.map((product) => {
          product.product_id != pid && newProducts.push(product);
        });
        cartFound.products = newProducts;
      } else {
        throw new Error(ERROR_NOT_FOUND_ID);
      }
      await cartFound.save();
      return cartFound;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
