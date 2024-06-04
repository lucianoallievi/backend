import express from "express";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
const PORT = 8080;

const ready = () => {
  console.log(`server ready on port: ${PORT}`);
};

const server = new express();

server.use(express.json());
server.use("/api/public", express.static(path.join("src", "public")));
server.listen(PORT, ready);
server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);
