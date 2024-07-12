import { Schema, model } from "mongoose";

const productSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [productSchema],
  },
  {
    timestamps: true,
    //toJSON: { virtuals: true },
  }
);

const cartModel = mongoose.model("carts", cartSchema);

export default cartModel;
