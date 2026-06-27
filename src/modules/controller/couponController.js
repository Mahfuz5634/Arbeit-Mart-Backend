import Coupon from "../../models/Coupon.js";

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expiryDate, isActive } = req.body;
    const newCoupon = new Coupon({
      code: code.toUpperCase(),
      discountPercentage,
      expiryDate: expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: isActive !== undefined ? isActive : true
    });
    const saved = await newCoupon.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    const { isActive, discountPercentage, expiryDate } = req.body;
    if (isActive !== undefined) coupon.isActive = isActive;
    if (discountPercentage !== undefined) coupon.discountPercentage = discountPercentage;
    if (expiryDate !== undefined) coupon.expiryDate = expiryDate;

    const updated = await coupon.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(400).json({ success: false, message: "Invalid coupon code" });
    }
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: "Coupon is inactive" });
    }
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }
    res.json({ success: true, discountPercentage: coupon.discountPercentage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
};
