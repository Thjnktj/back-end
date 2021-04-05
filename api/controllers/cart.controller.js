const Cart = require("../models/cart");

exports.getUserCart = (req, res) => {
  Cart.findOne({ user: req.user._id })
    .select("_id cartItems")
    .populate("cartItems.product", "_id name price slug productPictures")
    .then((cart) => {
      let products = {};
      let lists = {};
      let cost = 0;
      let count = 0;
      for (let item of cart.cartItems) {
        products = { ...products[item._id] };
        products._id = item.product._id;
        products.name = item.product.name;
        products.tagName = item.product.slug;
        products.price = item.product.price;
        products.images = `http://localhost:2000/images/${item.product.productPictures[0].img}`;
        products.numbers = item.quantity;
        products.inCart = item.quantity > 0 ? true : false;
        lists = { ...lists, [item.product._id]: products };
        cost += item.quantity * item.product.price;
        count += item.quantity;
      }

      const carts = {
        basketNumber: count,
        cartCost: cost,
        products: lists,
      };
      res.status(200).json({ carts });
    })
    .catch(() => {
      const carts = {
        basketNumber: 0,
        cartCost: 0,
        products: [],
      };
      res.status(200).json({ carts });
    });
};

exports.createCart = (req, res) => {
  Cart.findOne({ user: req.user._id }).exec((error, cart) => {
    if (error) return res.status(400).json({ error });
    if (cart) {
      const product = req.body.cartItems.product;
      const item = cart.cartItems.find((c) => c.product == product);
      let find, update;

      if (item) {
        find = { user: req.user._id, "cartItems.product": product };
        update = {
          $set: {
            "cartItems.$": {
              ...req.body.cartItems,
              quantity: item.quantity + req.body.cartItems.quantity,
            },
          },
        };
      } else {
        find = { user: req.user._id };
        update = {
          $push: {
            cartItems: req.body.cartItems,
          },
        };
      }
      Cart.findOneAndUpdate(find, update).exec((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) return res.status(201).json({ cart });
      });
    } else {
      const cart = new Cart({
        user: req.user._id,
        cartItems: [req.body.cartItems],
      });

      cart.save((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) return res.status(201).json({ cart });
      });
    }
  });
};
