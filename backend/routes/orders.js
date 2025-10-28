const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

router.post('/create', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Корзина пуста' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(400).json({ message: `Товар ${item.product.name} не найден` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Недостаточно товара: ${product.name}` });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        articleNumber: product.articleNumber
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      totalAmount,
      deliveryAddress: req.body.deliveryAddress
    });

    await order.save();
    await Cart.findOneAndUpdate({ user: req.user.userId }, { items: [] });

    res.status(201).json({ message: 'Заказ оформлен', order });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const userRole = req.user.role?.trim().toLowerCase()
    if (!['admin', 'cashier'].includes(userRole)) {
      return res.status(403).json({ message: 'Доступ запрещен: только администратор или кассир' })
    }
    const orders = await Order.find()
      .populate('user', 'username email firstName lastName')
      .populate('items.product')
      .sort({ createdAt: -1 })
    res.json({ orders })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const userRole = req.user.role?.trim().toLowerCase()
    if (!['admin', 'cashier'].includes(userRole)) {
      return res.status(403).json({ message: 'Доступ запрещен: только администратор или кассир' })
    }
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('items.product')
    res.json({ message: 'Статус обновлен', order })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})
module.exports = router;