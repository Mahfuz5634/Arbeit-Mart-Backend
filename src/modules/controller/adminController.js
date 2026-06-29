import Order from "../../models/Order.js";
import Product from "../../models/Product.js";

const getDashboardData = async (req, res) => {
  try {
    //fetch data from db
    const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const products = await Product.find({ isActive: true });

   //date calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisYearStart = new Date(today.getFullYear(), 0, 1);
    const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);

    let todaySales = 0, yesterdaySales = 0;
    let thisMonthSales = 0, lastMonthSales = 0;
    let thisYearSales = 0, lastYearSales = 0;

    //for weekly chart
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dataMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayLabel = days[d.getDay()];
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const key = `${dayLabel} (${dateStr})`;
      dataMap[key] = { name: key, sales: 0, dateObj: d };
    }

 
    orders.forEach(o => {
      const orderDate = new Date(o.createdAt);
      const amount = o.totalAmount || 0;

      // Stats Calculation
      if (orderDate >= today) todaySales += amount;
      else if (orderDate >= yesterday && orderDate < today) yesterdaySales += amount;

      if (orderDate >= thisMonthStart) thisMonthSales += amount;
      else if (orderDate >= lastMonthStart && orderDate < thisMonthStart) lastMonthSales += amount;

      if (orderDate >= thisYearStart) thisYearSales += amount;
      else if (orderDate >= lastYearStart && orderDate < thisYearStart) lastYearSales += amount;

      // Chart Calculation
      const chartDate = new Date(o.createdAt);
      chartDate.setHours(0, 0, 0, 0);
      Object.keys(dataMap).forEach(key => {
        if (chartDate.getTime() === dataMap[key].dateObj.getTime()) {
          dataMap[key].sales += amount;
        }
      });
    });

    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

   //funnel statege
    const allOrders = await Order.find(); 
    const funnelStages = [
      { name: 'Pending', count: allOrders.filter(o => o.orderStatus === 'Pending').length, desc: 'Awaiting confirmation' },
      { name: 'Confirmed', count: allOrders.filter(o => o.orderStatus === 'Confirmed').length, desc: 'Verified & processing' },
      { name: 'Shipped', count: allOrders.filter(o => o.orderStatus === 'Shipped').length, desc: 'In transit with courier' },
      { name: 'Delivered', count: allOrders.filter(o => o.orderStatus === 'Delivered').length, desc: 'Successfully completed' }
    ];

    //low stock
    const lowStockItems = [];
    products.forEach(product => {
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach(variant => {
          if (variant.stock < 5) {
            let priority = 'Medium';
            let priorityClass = 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
            if (variant.stock === 0) {
              priority = 'Critical';
              priorityClass = 'text-red-400 bg-red-500/10 border border-red-500/20';
            } else if (variant.stock <= 2) {
              priority = 'High';
              priorityClass = 'text-orange-400 bg-orange-500/10 border border-orange-500/20';
            }

            lowStockItems.push({
              productId: product._id,
              productName: product.name,
              sku: variant.sku,
              attributes: (() => {
                const attrs = variant.attributes || variant.attributeValues || {};
                const entries = typeof attrs.entries === 'function' ? Array.from(attrs.entries()) : Object.entries(attrs);
                return entries.map(([k, v]) => `${k}: ${v}`).join(', ');
              })(),
              stock: variant.stock,
              priority,
              priorityClass
            });
          }
        });
      }
    });

 
    res.json({
      stats: {
        todaySales,
        todayTrend: calculateTrend(todaySales, yesterdaySales),
        thisMonthSales,
        thisMonthTrend: calculateTrend(thisMonthSales, lastMonthSales),
        thisYearSales,
        thisYearTrend: calculateTrend(thisYearSales, lastYearSales),
        totalActiveProducts: products.length
      },
      salesChartData: Object.values(dataMap).map(({ name, sales }) => ({ name, sales })),
      funnelStages,
      lowStockItems
    });

  } catch (error) {
    console.error("Dashboard Data Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

export { getDashboardData };