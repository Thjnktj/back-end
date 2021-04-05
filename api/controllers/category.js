const Category = require("../models/category");
const slugify = require("slugify");

function createCategories(categories, parentId = null) {
  const categoryList = [];

  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.getCategory = (req, res) => {
  Category.find().exec((error, data) => {
    if (error) return res.status(400).json({ error });
    if (data) {
      const categories = createCategories(data);
      return res.status(200).json({ categories });
    }
  });
};

exports.createCategory = (req, res) => {
  const categories = {
    name: req.body.name,
    slug: slugify(req.body.name),
  };

  if (req.body.parentId) {
    categories.parentId = req.body.parentId;
  }

  const cat = new Category(categories);
  cat.save((error, category) => {
    if (error) return res.status(400).json({ error });
    if (category) return res.status(201).json({ category });
  });
};

exports.updateCategory = (req, res) => {
  const { _id, name, parentId } = req.body;

  const update = { name, slug: slugify(name) };

  if (parentId !== "") {
    update.parentId = parentId;
  }

  Category.findOneAndUpdate({ _id }, update, { new: true }).exec(
    (error, category) => {
      if (error) return res.status(400).json({ error });
      if (category)
        return res
          .status(201)
          .json({ message: "Cập nhật thành công", category });
    }
  );
};

exports.deleteCategory = async (req, res) => {
  const { _id, parentId } = req.body;
  if (parentId) {
    await Category.deleteOne({ _id }).then(() => {
      res.status(200).json({ message: "Đã xóa danh mục" });
    });
  } else {
    await Category.deleteOne({ _id }).then(async () => {
      await Category.deleteMany({ parentId: _id }).then(() => {
        res.status(200).json({ message: "Đã xóa danh mục" });
      });
    });
  }
};
