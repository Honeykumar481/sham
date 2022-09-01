"use strict";
var mongoose = require("mongoose");

var videoSchema = new mongoose.Schema(
  {
    createrId: { type: Number },
    name: { type: String },
    title: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("video", videoSchema);
