const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/User')
const auth = require('../middleware/auth')
const axios = require('axios')

router.get('/health', (req, res) => {
  res.json({
    message: 'Сервер SMART работает корректно!',
    timestamp: new Date().toISOString()
  })
})

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phoneNumber, passportNumber, bankCardNumber } = req.body

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Не все обязательные поля заполнены' })
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email или логином уже существует' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      passportNumber,
      bankCardNumber
    })

    await user.save()

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' })

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        passportNumber: user.passportNumber,
        bankCardNumber: user.bankCardNumber,
        deliveryAddress: user.deliveryAddress,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' })
    }

    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Неверный email или пароль' })
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' })

    res.json({
      message: 'Авторизация успешна',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        passportNumber: user.passportNumber,
        bankCardNumber: user.bankCardNumber,
        deliveryAddress: user.deliveryAddress,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' })
    }
    res.json({ user })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

router.put('/update', auth, async (req, res) => {
  try {
    const updates = req.body
    const allowedUpdates = ['firstName', 'lastName', 'email', 'phoneNumber', 'passportNumber', 'bankCardNumber', 'deliveryAddress']
    const filteredUpdates = {}
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field]
      }
    })

    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ message: 'Нет данных для обновления' })
    }

    if (filteredUpdates.email) {
      const existingUser = await User.findOne({ email: filteredUpdates.email, _id: { $ne: req.user.userId } })
      if (existingUser) {
        return res.status(400).json({ message: 'Email уже используется' })
      }
    }

    if (filteredUpdates.deliveryAddress) {
      const response = await axios.post('https://cleaner.dadata.ru/api/v1/clean/address', [filteredUpdates.deliveryAddress], {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token af18825804cefa054ca822cb7ad1d61d609aa5dc`,
          'X-Secret': 'df39ecd987299e812ffe724630cd9f127b3d80e3'
        }
      })
      const cleanedAddress = response.data[0]?.result
      if (!cleanedAddress) {
        return res.status(400).json({ message: 'Некорректный адрес' })
      }
      filteredUpdates.deliveryAddress = cleanedAddress
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-password')

    res.json({
      message: 'Профиль обновлён успешно',
      user
    })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен: только для администраторов' })
    }
    const users = await User.find().select('-password')
    res.json({ users })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

router.put('/users/:id/role', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен: только для администраторов' })
    }
    const { role } = req.body
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Неверная роль' })
    }
    const userId = req.params.id
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Некорректный ID пользователя' })
    }
    const userToUpdate = await User.findById(userId)
    if (!userToUpdate) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }
    userToUpdate.role = role
    await userToUpdate.save()
    res.json({ message: 'Роль обновлена', user: userToUpdate })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

router.delete('/users/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Некорректный ID пользователя' })
    }
    if (req.user.role !== 'admin' && req.user.userId !== userId) {
      return res.status(403).json({ message: 'Доступ запрещен: вы можете удалить только свой аккаунт' })
    }
    const userToDelete = await User.findById(userId)
    if (!userToDelete) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }
    await User.deleteOne({ _id: userId })
    res.json({ message: 'Аккаунт успешно удален' })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

module.exports = router