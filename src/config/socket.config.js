import { Server } from "socket.io";
// import ProductsManager from "../data/fs/products.js";
import ProductsManager from "../managers/ProductsManager.js";

const pm = new ProductsManager();
let serverSocket = null;

const config = (serverHTTP) => {
  serverSocket = new Server(serverHTTP);

  serverSocket.on("connection", async (socket) => {
    const response = await pm.getAll();
    console.log("Socket connected");

    serverSocket.emit("products-list", { response });

    socket.on("insert-product", async (data) => {
      await pm.insertOne(data);

      const response = await pm.getAll();
      serverSocket.emit("products-list", { response });
    });
    socket.on("delete-product", async (data) => {
      await pm.deleteOneById(data.id);
      const response = await pm.getAll();
      serverSocket.emit("products-list", { response });
    });
  });
};

const updateProductsList = async () => {
  const response = await pm.getAll();

  serverSocket.emit("products-list", { response });
};

export default { config, updateProductsList };
