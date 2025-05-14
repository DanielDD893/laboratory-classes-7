const Product = require("./Product");
const { getDatabase } = require('../database');

const COLLECTION_NAME = 'carts';

class Cart {
  constructor() {}

  static async add(productName) {
    const db = getDatabase();
    const product = await Product.findByName(productName);

    if (!product) {
      throw new Error(`Product '${productName}' not found.`);
    }

    const cart = await db.collection(COLLECTION_NAME).findOne({});
    
    if (!cart) {
      await db.collection(COLLECTION_NAME).insertOne({
        items: [{ product, quantity: 1 }]
      });
      return;
    }

    const existingItem = cart.items.find(
      (item) => item.product.name === productName
    );

    if (existingItem) {
      await db.collection(COLLECTION_NAME).updateOne(
        { 'items.product.name': productName },
        { $inc: { 'items.$.quantity': 1 } }
      );
    } else {
      await db.collection(COLLECTION_NAME).updateOne(
        {},
        { $push: { items: { product, quantity: 1 } } }
      );
    }
  }

  static async getItems() {
    const db = getDatabase();
    const cart = await db.collection(COLLECTION_NAME).findOne({});
    return cart ? cart.items : [];
  }

  static async getProductsQuantity() {
    const items = await this.getItems();
    if (!items?.length) {
      return 0;
    }

    return items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }

  static async getTotalPrice() {
    const items = await this.getItems();
    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  static async clearCart() {
    const db = getDatabase();
    await db.collection(COLLECTION_NAME).deleteMany({});
  }
}

module.exports = Cart;
