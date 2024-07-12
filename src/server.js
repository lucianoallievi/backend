import express from "express";
import paths from "./utils/paths.js";
import productsRouter from "./routes/api/products.router.js";
import cartsRouter from "./routes/api/carts.router.js";
import homeRouter from "./routes/app/home.router.js";
import handlebars from "./config/handlebars.config.js";
import serverSocket from "./config/socket.config.js";
import mongoDB from "./config/mongoose.config.js";

const HOST = "localhost";
const PORT = 8080;

const ready = () => {
  console.log(`server ready on port: ${PORT}`);
};

const server = new express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/", homeRouter);
server.use("/api/public", express.static(paths.public));
server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);

const serverHTTP = server.listen(PORT, () => {
  console.log(`Ejecutándose en http://${HOST}:${PORT}`);
  mongoDB.connectDB();
});

handlebars.config(server);

//server.listen(PORT, ready);

serverSocket.config(serverHTTP);
