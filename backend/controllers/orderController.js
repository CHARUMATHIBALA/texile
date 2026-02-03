import Order from '../models/Order.js';

const ALLOWED_STATUSES = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x.productId || x._id,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderStatus: 'Placed',
      statusHistory: [{ status: 'Placed', date: Date.now(), note: 'Order placed' }],
    });

    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to create order' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Get order by ID (user can only access own order; admin can access any)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email role');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isAdmin = req.user?.role === 'admin' || req.user?.isAdmin;
    const isOwner = String(order.user?._id || order.user) === String(req.user?._id);
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Access denied. You can only view your own orders.' });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch order' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = async (req, res) => {
  const { status, note } = req.body;
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid order status' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  if (order.orderStatus !== status) {
    order.orderStatus = status;
    order.statusHistory = Array.isArray(order.statusHistory) ? order.statusHistory : [];
    order.statusHistory.push({ status, date: Date.now(), note });
  }

  if (status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.cancelledAt = undefined;
  }
  if (status === 'Cancelled') {
    order.cancelledAt = Date.now();
    order.isDelivered = false;
    order.deliveredAt = undefined;
  }
  const updated = await order.save();
  res.json(updated);
};

export { addOrderItems, getMyOrders, getOrderById, getOrders, updateOrderStatus };
