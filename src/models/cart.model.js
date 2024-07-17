import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
  },
  amount: { type: Number, default: 1 },
});

const cartSchema = new Schema(
  {
    products: {
      type: [productSchema],
    },
  },
  {
    timestamps: true,
    //toJSON: { virtuals: true },
  }
);

cartSchema.pre("save", function (next) {
  const products = this.products;
  const uniqueProducts = new Set(products.map((product) => product.product_id));
  console.log(uniqueProducts);
  if (uniqueProducts.size !== products.length) {
    const error = new Error(
      "No se permiten productos duplicados en el carrito"
    );
    next(error);
  } else {
    next();
  }
});

productSchema.plugin(paginate);

cartSchema.plugin(paginate);

const cartModel = model("carts", cartSchema);

export default cartModel;
