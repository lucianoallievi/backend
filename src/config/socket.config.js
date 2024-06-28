import { Server } from "socket.io";
import ProductsManager from "../data/fs/products.js";

const pm = new ProductsManager();
let serverSocket = null;

const config = (serverHTTP) => {
  serverSocket = new Server(serverHTTP);

  serverSocket.on("connection", async (socket) => {
    const products = await pm.getProducts();
    console.log("Socket connected");

    serverSocket.emit("products-list", { products });

    socket.on("insert-product", async (data) => {
      await pm.createProduct(data);
      const products = await pm.getProducts();

      serverSocket.emit("products-list", { products });
    });

    serverSocket.on("delete-product", async (data) => {
      await pm.deleteProduct(data.id);
      const products = await pm.getProducts();

      serverSocket.emit("products-list", { products });
    });
  });
};

const updateProductsList = async () => {
  const products = await pm.getProducts();

  serverSocket.emit("products-list", { products });
};

export default { config, updateProductsList };
