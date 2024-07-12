import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El nombre es requerido"],
      uppercase: true,
    },
    description: {},
    code: {},
    price: {},
    stock: {},
    category: {},
  },
  {
    timestamps: true,
    //toJSON: { virtuals: true },
  }
);

productSchema.plugin(paginate);
const productModel = model("products", productSchema);

export default productModel;

/*
"id": "afa7057f7e7fa4d703363e7d",
"status": true,
"title": "Escritorio",
"description": "Escritorio de PC",
"code": "Z09G",
"price": 470500,
"stock": 100,
"category": "muebles"
*/
