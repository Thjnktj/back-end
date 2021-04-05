const util = require("util");
const path = require("path");
const multer = require("multer");

//setup config save files
let storage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, path.join(`${__dirname}/../../api/uploads`));
  },
  filename: (req, file, callback) => {
    let match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      let errMess = "Chỉ cho phép tải ảnh .jpg hoặc .png";
      return callback(errMess, null);
    }
    let filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  },
});

let upload = multer({ storage: storage }).array("images", 10);

let multiple = util.promisify(upload);

module.exports = multiple;
