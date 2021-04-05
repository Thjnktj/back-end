const Product = require("../models/product");
const Category = require("../models/category");
const slugify = require("slugify");

function renderProduct(array) {
  const list = array.map((item) => {
    return {
      _id: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      slug: item.slug,
      category: item.category,
      images: item.productPictures.map((img) => {
        return {
          url: `http://localhost:2000/images/${img.img}`,
        };
      }),
      description: item.description,
    };
  });
  return list;
}

exports.getProduct = (req, res) => {
  Product.find()
    .populate({ path: "category", select: "_id name" })
    .exec((error, products) => {
      if (error) return res.status(400).json({ error });
      if (products) {
        const cheap = products.filter(
          (product) => product.price > 4000000 && product.price < 10000000
        );
        const midrange = products.filter(
          (product) => product.price > 10000000 && product.price < 15000000
        );
        const luxury = products.filter((product) => product.price > 15000000);
        res.status(200).json({
          products: renderProduct(products),
          cheap: renderProduct(cheap),
          midrange: renderProduct(midrange),
          luxury: renderProduct(luxury),
        });
      }
    });
};

exports.getProductBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json(error);
      }
      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          res.status(200).json({ products: renderProduct(products) });
        });
      }
    });
};

exports.findProductByPrice = (req, res) => {
  const { query } = req.body;
  console.log(query);
};

exports.createProduct = (req, res) => {
  const { name, price, quantity, description, images, category } = req.body;

  const product = new Product({
    name: name,
    slug: slugify(name),
    price: price,
    quantity: quantity,
    description: description,
    category: category,
    productPictures: images,
    createBy: req.user._id,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) return res.status(201).json({ product });
  });
};

exports.updateProduct = (req, res) => {
  const {
    _id,
    name,
    price,
    quantity,
    description,
    category,
    images,
  } = req.body;

  const update = {
    name,
    slug: slugify(name),
    price,
    quantity,
    description,
    category,
  };

  if (images.length > 0) {
    update.images = images;
  }

  Product.findOneAndUpdate({ _id }, update, { new: true }).exec(
    (error, result) => {
      if (error) return res.status(400).json({ error });
      if (result)
        return res
          .status(201)
          .json({ message: "Cập nhật sản phẩm thành công" });
    }
  );
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  Product.findByIdAndDelete({ _id: id }).exec((error, result) => {
    if (error) return res.status(400).json({ error });
    if (result)
      return res.status(200).json({ message: "Xóa sản phẩm thành công" });
  });
};
