import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send('Some error occured');

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId // The database Order ID
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Database update logic
      // Find the order and update status
      const order = await Order.findById(orderId);

      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: razorpay_payment_id,
          status: 'success',
          update_time: Date.now(),
          email_address: req.user.email,
        };

        if (order.orderStatus === 'Placed') {
          order.orderStatus = 'Confirmed';
          order.statusHistory = Array.isArray(order.statusHistory) ? order.statusHistory : [];
          order.statusHistory.push({ status: 'Confirmed', date: Date.now(), note: 'Payment confirmed' });
        }

        const updatedOrder = await order.save();

        res.json({
          message: 'Payment verified successfully',
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          dbOrder: updatedOrder
        });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } else {
      res.status(400).json({
        message: 'Invalid signature',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export {
  createRazorpayOrder,
  verifyPayment,
};
