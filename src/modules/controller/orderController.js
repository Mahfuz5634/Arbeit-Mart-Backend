import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import ShippingZone from "../../models/ShippingZone.js";
import Coupon from "../../models/Coupon.js";

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("orderItems.product")
      .populate("shippingZone")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const {
      customerInfo,
      orderItems,
      shippingAddress,
      shippingZone,
      couponCode,
      paymentMethod
    } = req.body;

    if (!customerInfo || !orderItems || !shippingAddress || !shippingZone || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const zone = await ShippingZone.findById(shippingZone);
    if (!zone) {
      return res.status(400).json({ message: "Invalid shipping zone" });
    }
    const shippingCost = zone.cost;

    let itemsPrice = 0;
    const processedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      const variant = product.variants.find(v => v.sku === item.variantSku);
      if (!variant) {
        return res.status(400).json({ message: `Variant SKU ${item.variantSku} not found` });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for SKU ${item.variantSku}` });
      }

      variant.stock -= item.quantity;
      await product.save();

      itemsPrice += variant.price * item.quantity;
      processedItems.push({
        product: product._id,
        variantSku: variant.sku,
        quantity: item.quantity,
        price: variant.price
      });
    }

    let discountApplied = 0;
    let couponInfoObj = { code: "", discountApplied: 0 };

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && new Date(coupon.expiryDate) > new Date()) {
        discountApplied = Number(((itemsPrice * coupon.discountPercentage) / 100).toFixed(2));
        couponInfoObj = { code: coupon.code, discountApplied };
      }
    }

    const totalAmount = Math.max(0, itemsPrice + shippingCost - discountApplied);

    const order = new Order({
      customerInfo,
      orderItems: processedItems,
      shippingAddress,
      shippingZone: zone._id,
      couponInfo: couponInfoObj,
      paymentMethod,
      itemsPrice,
      shippingCost,
      totalAmount
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    order.orderStatus = status;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  getOrders,
  createOrder,
  updateOrderStatus
};
