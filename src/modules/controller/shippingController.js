import ShippingZone from "../../models/ShippingZone.js";

const getShippingZones = async (req, res) => {
  try {
    const zones = await ShippingZone.find({});
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createShippingZone = async (req, res) => {
  try {
    const { zoneName, cost, regions } = req.body;
    let finalRegions = [];
    if (typeof regions === "string") {
      finalRegions = regions.split(",").map(r => r.trim()).filter(r => r.length > 0);
    } else if (Array.isArray(regions)) {
      finalRegions = regions;
    }
    const zone = new ShippingZone({
      zoneName,
      cost,
      regions: finalRegions
    });
    const saved = await zone.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateShippingZone = async (req, res) => {
  try {
    const zone = await ShippingZone.findById(req.params.id);
    if (!zone) return res.status(404).json({ message: "Shipping zone not found" });

    const { zoneName, cost, regions } = req.body;
    if (zoneName !== undefined) zone.zoneName = zoneName;
    if (cost !== undefined) zone.cost = cost;
    if (regions !== undefined) {
      if (typeof regions === "string") {
        zone.regions = regions.split(",").map(r => r.trim()).filter(r => r.length > 0);
      } else if (Array.isArray(regions)) {
        zone.regions = regions;
      }
    }

    const updated = await zone.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteShippingZone = async (req, res) => {
  try {
    const deleted = await ShippingZone.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Shipping zone not found" });
    res.json({ message: "Shipping zone deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getShippingZones,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone
};
