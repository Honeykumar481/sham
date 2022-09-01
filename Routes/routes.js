"use strict";
module.exports = function (app) {
  var upload = require("../controllers/controller");
  app.route("/createUser").post(upload.uploadFile);
};
