import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  attributes: { type: Map, of: String }, 
  price: { type: Number, required: true }, 
  stock: { type: Number, required: true, default: 0 },
  image: { type: String }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  basePrice: { type: Number, required: true },
  coverImage: { type: String }, 
  attributes: [{
    name: { type: String }, 
    values: [{ type: String }] 
  }],
  variants: [variantSchema], 
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);