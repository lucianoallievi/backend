import mongoose from "mongoose";
import ProductModel from "../models/ProductModel.js";
import mongoDB from "../config/mongoose.config.js";

import {
  ERROR_DELETE_DOCUMENT,
  ERROR_INVALID_ID,
  ERROR_NOT_FOUND_ID,
} from "../constants/messages.constants.js";

export default class ProductsManager {
  #productModel;

  constructor() {
    this.#productModel = ProductModel;
  }

  getAll = async (paramFilters) => {
    try {
      const $and = [];
      console.log(paramFilters.title);
      if (paramFilters?.title) $and.push({ title: paramFilters.title });
      if (paramFilters?.code) $and.push({ code: paramFilters.code });
      if (paramFilters?.category)
        $and.push({ category: paramFilters.category });

      const filters = $and.lenght > 0 ? { $and } : {};

      const sort = {
        asc: { name: 1 },
        desc: { name: -1 },
      };

      const paginationOptions = {
        limit: paramFilters.limit ?? 10,
        page: paramFilters.page ?? 1,
        sort: sort[paramFilters?.sort] ?? {},
      };
      const productsFound = await this.#productModel.paginate(
        filters,
        paginationOptions
      );
      console.log(productsFound);
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
      const productCreated = new ProductModel(data);
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

      productFound.title = data.title;
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