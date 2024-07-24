import { connect, Types } from "mongoose";
import dotenv from "dotenv";

const connectDB = () => {
  dotenv.config();

  const URI = process.env.DATABASE_URL;
  const BASE = process.env.DATABASE_NAME;

  const options = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    dbName: BASE,
  };

  connect(URI, options)
    .then(() => console.log(`Conectado a MongoDB. Base: ${BASE}`))
    .catch((err) => console.error("Error al conectar con MongoDB", err));
};
const isValidID = (id) => {
  return Types.ObjectId.isValid(id);
};
export default {
  connectDB,
  isValidID,
};
