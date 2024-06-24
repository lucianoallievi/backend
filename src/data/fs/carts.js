import fs from "fs";
import path from "path";
import crypto from "crypto";

export default class CartManager {
  #cartsFilePath;

  constructor() {
    this.#cartsFilePath = path.join("src", "data", "fs", "files", "carts.json");
  }

  #readCarts = async () => {
    if (!fs.existsSync(this.#cartsFilePath)) {
      await fs.promises.writeFile(this.#cartsFilePath, "[]");
    }

    const carts = await fs.promises.readFile(this.#cartsFilePath, "utf8");
    const cartsJSON = JSON.parse(carts);
    return cartsJSON;
  };

  #writeNewCart = async (newCart) => {
    const carts = await this.#readCarts();
    carts.push(newCart);
    const cartsString = JSON.stringify(carts);
    await fs.promises.writeFile(this.#cartsFilePath, cartsString);
  };

  #writeCarts = async (carts) => {
    const cartsString = JSON.stringify(carts);
    await fs.promises.writeFile(this.#cartsFilePath, cartsString);
  };

  createCart = async (cart) => {
    const id = crypto.randomBytes(12).toString("hex");
    const newCart = { id, ...cart };
    await this.#writeNewCart(newCart);
    return newCart;
  };

  getCarts = async () => {
    const carts = await this.#readCarts();
    return carts;
  };

  getCartById = async (id) => {
    const carts = await this.#readCarts();
    const cart = carts.find((each) => each.id == id);
    return cart;
  };

  updateCarts = async (updatedCart) => {
    const carts = await this.#readCarts();
    const newCarts = carts.map((each) => {
      if (each.id == updatedCart.id) {
        return updatedCart;
      } else {
        return each;
      }
    });
    await this.#writeCarts(newCarts);
  };
}
