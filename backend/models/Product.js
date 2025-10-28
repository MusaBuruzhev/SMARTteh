const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  characteristics: { type: Object, default: {} },
  articleNumber: { type: String, required: true, unique: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

productSchema.pre('save', async function(next) {
  console.log('Running pre-save hook for articleNumber');
  if (!this.articleNumber) {
    let isUnique = false;
    let newArticle;
    while (!isUnique) {
      newArticle = `ART-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const existing = await mongoose.model('Product').findOne({ articleNumber: newArticle });
      if (!existing) {
        isUnique = true;
      }
    }
    this.articleNumber = newArticle;
    console.log('Generated articleNumber:', this.articleNumber);
  }
  next();
});

productSchema.pre('findOneAndUpdate', async function(next) {
  console.log('Running pre-findOneAndUpdate hook for articleNumber');
  if (!this._update.articleNumber) {
    let isUnique = false;
    let newArticle;
    while (!isUnique) {
      newArticle = `ART-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const existing = await mongoose.model('Product').findOne({ articleNumber: newArticle });
      if (!existing) {
        isUnique = true;
      }
    }
    this._update.articleNumber = newArticle;
    console.log('Generated articleNumber for update:', this._update.articleNumber);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);