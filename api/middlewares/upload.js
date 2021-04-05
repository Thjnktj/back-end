const multiple = require("./multiple");

exports.upload = async (req, res, next) => {
  try {
    await multiple(req, res);
    let listImages = req.files
      ? req.files.map((item) => {
          return {
            img: item.filename,
          };
        })
      : [];
    req.body.images = listImages;
  } catch (error) {
    console.log(error);
  }
  next();
};
