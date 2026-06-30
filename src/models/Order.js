import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantSku: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },

  orderItems: [orderItemSchema],

  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true }
  
  },
  
  shippingZone: { type: mongoose.Schema.Types.ObjectId, ref: 'ShippingZone', required: true },
  
  couponInfo: {
    code: { type: String },
    discountApplied: { type: Number, default: 0 }
  },
  
  paymentMethod: { type: String, enum: ['COD', 'Mock Credit Card'], required: true },
  itemsPrice: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);