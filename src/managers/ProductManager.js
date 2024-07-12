import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";

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

  insertOne = async () => {};
}
