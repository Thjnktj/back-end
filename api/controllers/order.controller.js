const Order = require("../models/order");
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getAllOrder = (req, res) => {
  Order.find()
    .select("_id orders user")
    .populate("orders.product", "_id name price slug productPictures")
    .populate("user", "_id firstName lastName address phone")
    .then((orders) => {
      const order = orders.map((order) => {
        return {
          _id: order._id,
          user: order.user,
          orders: order.orders,
        };
      });
      res.status(200).json(order);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

exports.findSells = (req, res) => {
  const { start, end } = req.body;
  const newStart = new Date(start);
  const newEnd = new Date(end);
  Order.find({
    "orders.ordered": true,
    "orders.dateCheckOut": { $gte: newStart },
    "orders.dateCheckOut": { $lte: newEnd },
  })
    .select("_id user orders")
    .populate("user", "_id firstName lastName")
    .populate("orders.product", "_id name price")
    .then((order) => {
      if (order.length > 0) {
        let total = 0;
        for (let item of order) {
          for (let ord of item.orders) {
            total += ord.quantity * ord.product.price;
          }
        }
        res.status(200).json({ message: "Thống kê doanh số", order, total });
      } else {
        res.status(200).json({ message: "Không có kết quả" });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.checkOrder = (req, res) => {
  const find = { _id: req.body.id };
  Order.findOne(find)
    .then((docs) => {
      let isFalse = [];
      let isTrue = [];

      //Tìm đơn hàng mới với giá trị ordered=false và cập nhật lại trạng thái
      //Nếu đơn hàng cũ thì lấy lại toàn bộ
      for (let item of docs.orders) {
        if (!item.ordered) {
          isFalse.push(item);
          isTrue.push({
            _id: item._id,
            product: item.product,
            quantity: item.quantity,
            ordered: true,
            dateBuy: item.dateBuy,
            dateCheckOut: Date.now(),
          });
        } else {
          isTrue.push(item);
        }
      }

      const update = {
        orders: isTrue,
      };

      //Cập nhật lại thông tin đơn hàng của khách
      Order.findOneAndUpdate(find, update, { new: true }).then((doc) => {
        if (doc) {
          let message = [];

          //Cập nhật lại số lượng sản phẩm
          for (let item of isFalse) {
            let fid = { _id: item.product };

            //Tìm đến sản phẩm để lấy số lượng hiện có
            Product.findOne(fid).then((product) => {
              if (product) {
                let up = {
                  quantity:
                    product.quantity > 0 ? product.quantity - item.quantity : 0,
                };

                //Cập nhật số lượng sản phẩm
                Product.findOneAndUpdate(fid, up, { new: true }).then(
                  (result) => {
                    if (result) {
                      message.push({ mess: `Cập nhật thành công` });
                    }
                  }
                );
              }
            });
          }
          res
            .status(200)
            .json({ message: "Đặt hàng thành công", update: message });
        }
      });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.postOrder = (req, res) => {
  let find = { user: req.user._id };
  Cart.findOne(find)
    .select("_ id cartItems")
    .then((data) => {
      //Lấy các sản phẩm có số lượng lớn hơn 0
      const prod = data.cartItems.filter((item) => item.quantity > 0);

      //Xóa giỏ hàng của khách hàng
      Cart.deleteOne({ _id: data._id }).then(() => {});

      //Tìm đơn hàng của khách hàng nếu đã có đơn hàng trước thì cập nhật thêm đơn hàng mới
      //Nếu chưa có thì tạo đơn hàng mới cho khách hàng
      Order.findOne(find).exec((error, order) => {
        if (error) return res.status(400).json(error);
        if (order) {
          let update = {
            $push: {
              orders: prod,
            },
          };
          Order.findOneAndUpdate(find, update).exec((error, order) => {
            if (error) return res.status(400).json(error);
            if (order) {
              res
                .status(201)
                .json({ message: "Cập nhật đơn hàng thành công", order });
            }
          });
        } else {
          const ord = new Order({
            user: req.user._id,
            orders: prod,
          });
          ord.save((error, order) => {
            if (error) return res.status(400).json(error);
            if (order) {
              res
                .status(201)
                .json({ message: "Thêm đơn hàng thành công", order });
            }
          });
        }
      });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
