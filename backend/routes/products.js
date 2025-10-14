const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Список всех товаров
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error in /list:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Добавление товара
router.post('/add', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    console.log('Received data:', req.body);
    console.log('Received files:', req.files);
    console.log('Received characteristics:', req.body.characteristics);

    const { name, description, price, stock, category, characteristics } = req.body;

    if (!name || !description || price === undefined || stock === undefined || !category) {
      return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' });
    }

    let parsedCharacteristics = {};
    try {
      parsedCharacteristics = JSON.parse(characteristics);
    } catch (error) {
      return res.status(400).json({ message: 'Некорректный формат характеристик' });
    }

    if (!req.files || req.files.length < 3 || req.files.length > 10) {
      return res.status(400).json({ message: 'Требуется от 3 до 10 изображений' });
    }

    const images = req.files.map(file => `/uploads/${file.filename}`);

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      characteristics: parsedCharacteristics,
      images,
      articleNumber: `ART-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    });

    console.log('Product to save:', product);

    await product.save();
    res.status(201).json({ message: 'Товар успешно добавлен', product });
  } catch (error) {
    console.error('Error in /add:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Ошибка: Артикул уже существует' });
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Ошибка валидации: ' + error.message });
    } else {
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  }
});

// Получение товара по ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error('Error in /:id:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Обновление товара
router.put('/update/:id', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const { name, description, price, stock, category, characteristics, mode = 'add' } = req.body;

    if (!name || !description || price === undefined || stock === undefined || !category) {
      return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' });
    }

    let parsedCharacteristics = {};
    try {
      parsedCharacteristics = JSON.parse(characteristics);
    } catch (error) {
      return res.status(400).json({ message: 'Некорректный формат характеристик' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Товар не найден' });

    const updateData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      characteristics: parsedCharacteristics
    };

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      if (mode === 'replace') {
        if (newImages.length < 3) return res.status(400).json({ message: 'Для замены требуется минимум 3 изображения' });
        updateData.images = newImages;
      } else {
        const totalImages = (product.images.length + newImages.length);
        if (totalImages > 10) return res.status(400).json({ message: `Максимум 10 изображений всего. Сейчас будет ${totalImages}` });
        updateData.images = [...product.images, ...newImages];
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: 'Товар обновлён', product: updatedProduct });
  } catch (error) {
    console.error('Error in /update/:id:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Удаление изображения
router.delete('/:id/image/:index', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Товар не найден' });

    const index = parseInt(req.params.index);
    if (isNaN(index) || index < 0 || index >= product.images.length) {
      return res.status(400).json({ message: 'Неверный индекс изображения' });
    }

    product.images.splice(index, 1);
    await product.save();

    res.status(200).json({ message: 'Изображение удалено', product });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление товара
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    res.status(200).json({ message: 'Товар успешно удалён' });
  } catch (error) {
    console.error('Error in /delete/:id:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

module.exports = router;