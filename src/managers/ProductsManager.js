import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";
import { convertToBoolean } from "../utils/converter.js";

import {
  ERROR_DELETE_DOCUMENT,
  ERROR_INVALID_ID,
  ERROR_NOT_FOUND_ID,
} from "../constants/messages.constants.js";

export default class ProductsManager {
  #productModel;

  constructor() {
    this.#productModel = productModel;
  }

  getAll = async (paramFilters) => {
    try {
      const $and = [];

      if (paramFilters?.name)
        $and.push({ name: { $regex: paramFilters.name, $options: "i" } });
      if (paramFilters?.category)
        $and.push({ category: paramFilters.category });
      if (paramFilters?.available)
        $and.push({
          available: convertToBoolean(paramFilters.available),
        });
      const filters = $and.length > 0 ? { $and } : {};

      const sort = {
        asc: { price: 1 },
        desc: { price: -1 },
      };

      const paginationOptions = {
        limit: paramFilters?.limit ?? 10,
        page: paramFilters?.page ?? 1,
        sort: sort[paramFilters?.sort] ?? {},
        lean: true,
      };
      const productsFound = await this.#productModel.paginate(
        filters,
        paginationOptions
      );
      //console.log(productsFound);
      return productsFound;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getOneByID = async (id) => {
    try {
      if (!mongoDB.isValidID(id)) {
        throw new Error(ERROR_INVALID_ID);
      }

      const productFound = await this.#productModel.findById(id);

      if (!productFound) throw new Error(ERROR_NOT_FOUND_ID);

      return productFound;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  insertOne = async (data) => {
    try {
      const productCreated = new productModel(data);
      await productCreated.save();

      return productCreated;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateOneById = async (id, data) => {
    try {
      if (!mongoDB.isValidID(id)) {
        throw new Error(ERROR_INVALID_ID);
      }
      const productFound = await this.#productModel.findById(id);

      if (!productFound) throw new Error(ERROR_NOT_FOUND_ID);

      productFound.name = data.name;
      productFound.description = data.description;
      productFound.code = data.code;
      productFound.price = data.price;
      productFound.stock = data.stock;
      productFound.category = data.category;

      await productFound.save();

      return productFound;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  deleteOneById = async (id) => {
    try {
      if (!mongoDB.isValidID(id)) {
        throw new Error(ERROR_INVALID_ID);
      }

      const productFound = await this.#productModel.findById(id);

      if (!productFound) throw new Error(ERROR_NOT_FOUND_ID);

      await this.#productModel.findByIdAndDelete(id);

      return productFound;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
