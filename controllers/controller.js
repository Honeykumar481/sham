"use strict";
const mongoose = require("mongoose");

var Video = mongoose.model("video");
var fs = require("fs");
var multer = require("multer");
var sharp = require("sharp");
var path = require("path");
const uploadFile = async (req, res) => {
  try {
    let dir = "data/video1/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, dir);
      },
      filename: function (req, file, cb) {
        var fileExtn = file.originalname.split(".").pop(-1);
        cb(null, new Date().getTime() + "." + fileExtn);
      },
    });
    var upload = multer({ storage: storage }).single("video");

    upload(req, res, async function (err) {
      var filesave = path.join(
        __dirname,
        "./",
        "output",
        new Date().getTime() + ".jpeg"
      );

      console.log(filesave);

      var f = filesave.replace(/^.*[\\\/]/, "");
      console.log(f);

      let sh = sharp(req.file.path);
      console.log(req.file.path);

      function getExtension(filenames) {
        let ext = path.extname(filenames || "").split(".");
        console.log(ext);
        return ext[ext.length - 1];
      }
      console.log(req.file.filename);
      const fileFormat = getExtension(req.file.filename);
      if (fileFormat === "jpg" || fileFormat === "jpeg") {
        sh = sh.jpeg({ quality: 70 });
      } else if (fileFormat === "png") {
        sh = sh.png({ quality: 10 });
      }

      sh.toFile(filesave, function (err, info) {
        if (err) {
          console.log(err);
          console.log("error in image optimization");
        }
        fs.unlinkSync(req.file.path);
      });

      const data = {
        name: f,
        title: req.body.title,
        creatorsid: req.body.creatorsid,
      };
      console.log(data);

      const newUser = new Video(data);

      let newVideoRes = await newUser.save();
      res.send(newVideoRes);
    });
  } catch (err) {
    res.send(err);
  }
};
exports.uploadFile = uploadFile;
