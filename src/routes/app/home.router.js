import { Router } from "express";

const router = new Router();

const RESPONSE_MESSAGE_500 = "Hubo un error en el servidor HTTP";

router.get("/products", async (req, res) => {
  try {
    res.status(200).render("index", { title: "Inicio" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: RESPONSE_MESSAGE_500 });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.status(200).render("realTimeProducts", { title: "Tiempo real" });
  } catch (error) {
    //res.send(error.message);
    res.status(500).json({ status: false, message: RESPONSE_MESSAGE_500 });
  }
  res.send(RESPONSE_MESSAGE_500);
});

export default router;
