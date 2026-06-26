import mongoose from "mongoose";

const shippingZoneSchema = new mongoose.Schema({
  zoneName: { type: String, required: true }, 
  cost: { type: Number, required: true },
  regions: [{ type: String }] 
}, { timestamps: true });

export default mongoose.model('ShippingZone', shippingZoneSchema);