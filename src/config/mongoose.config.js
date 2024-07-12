import { connect, Types } from "mongoose";

const connectDB = () => {
  const URI =
    "mongodb+srv://lucianoallievi:lXNb1NN1cfoMIKxp@mycluster.dng0g8l.mongodb.net/";

  const options = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    dbName: "e-commerce",
  };

  connect(URI, options)
    .then(() => console.log("Conectado a MongoDB"))
    .catch((err) => console.error("Error al conectar con MongoDB", err));
};
const isValidID = (id) => {
  return Types.ObjectId.isValid(id);
};
export default {
  connectDB,
  isValidID,
};
