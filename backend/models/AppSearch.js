const mongoose = require("mongoose");

const AppSearchSchema = new mongoose.Schema({
  appName: String,
  searchedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "AppSearch",
  AppSearchSchema
);