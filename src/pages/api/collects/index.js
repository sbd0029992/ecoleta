import { dbConnect } from 'utils/mongosee';

import authMiddleware from '/src/middlewares/authMiddleware';
import Cart from '/src/models/Cart';

dbConnect();

async function handler(req, res) {
  const { method, body } = req;

  switch (method) {
    case 'GET':
      try {
        const userId = req.query.userId;
        const carts = await Cart.find({
          user: userId,
          status: 1,
        }).populate(['user', 'product']); // Pasamos un array a .populate()

        return res.status(200).json(carts);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    case 'POST':
      try {
        const newCart = new Cart(body);
        const savedCart = await newCart.save();
        const populatedCart = await savedCart
          .populate(['user', 'product']) // Pasamos un array a .populate()
          .execPopulate();
        return res.status(201).json(populatedCart);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    default:
      return res.status(400).json({ msg: 'This method is not supported' });
  }
}

export default authMiddleware(handler);
