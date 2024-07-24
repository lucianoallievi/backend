import express from "express";
import paths from "./utils/paths.js";
import productsRouter from "./routes/api/products.routes.js";
import cartsRouter from "./routes/api/carts.routes.js";
import homeRouter from "./routes/app/home.routes.js";
import handlebars from "./config/handlebars.config.js";
import serverSocket from "./config/socket.config.js";
import mongoDB from "./config/mongoose.config.js";

const server = new express();
const PORT = 8080;
const HOST = "localhost";

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/", homeRouter);
server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);

server.use("/public", express.static(paths.public));

handlebars.config(server);

server.use("*", (req, res) => {
  res
    .status(404)
    .send(
      "<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>"
    );
});

server.use((error, req, res) => {
  console.log("Error:", error.message);
  res
    .status(500)
    .send("<h1>Error 500</h1><h3>Se ha generado un error en el servidor</h3>");
});

const serverHTTP = server.listen(PORT, () => {
  console.log(`Ejecutándose en http://${HOST}:${PORT}`);
  mongoDB.connectDB();
});

serverSocket.config(serverHTTP);
