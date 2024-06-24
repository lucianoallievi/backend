import fs from "fs";
import path from "path";
import crypto from "crypto";

export default class ProductsManager {
  #productsFilePath;

  constructor() {
    this.#productsFilePath = path.join(
      "src",
      "data",
      "fs",
      "files",
      "products.json"
    );
  }

  #readProducts = async () => {
    if (!fs.existsSync(this.#productsFilePath)) {
      await fs.promises.writeFile(this.#productsFilePath, "[]");
    }

    const productsJSON = await fs.promises.readFile(
      this.#productsFilePath,
      "utf8"
    );

    return JSON.parse(productsJSON);
  };

  #writeProducts = async (newProduct) => {
    const products = await this.#readProducts();

    products.push(newProduct);

    const productsString = JSON.stringify(products, null, "\t");

    await fs.promises.writeFile(this.#productsFilePath, productsString);
  };

  createProduct = async (product) => {
    const id = crypto.randomBytes(12).toString("hex");
    const newProduct = { id, ...product };
    await this.#writeProducts(newProduct);
    return newProduct;
  };

  getProducts = async () => {
    const products = await this.#readProducts();
    return products;
  };

  getProductByID = async (id) => {
    const products = await this.#readProducts();
    const product = products.find((each) => each.id == id);
    return product;
  };

  updateProduct = async (newProduct) => {
    let newProducts;
    const products = await this.#readProducts();
    const product = products.find((each) => each.id == newProduct.id);
    if (product) {
      newProducts = products.map((each) => each.id != newProduct.id);
      newProducts.push(newProduct);
      await this.#writeProducts(newProducts);
    }
  };

  deleteProduct = async (id) => {
    let newProducts;
    const products = await this.#readProducts();
    const product = products.find((each) => each.id == id);
    if (product) {
      newProducts = products.map((each) => each.id != id);
      await this.#writeProducts(newProducts);
    }
  };
}
