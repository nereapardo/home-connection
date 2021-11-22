const { Schema, model } = require("mongoose");

const houseSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    area: { type: String, required: true },
    rooms: { type: String, required: true },
    photo: { type: String },
    description: { type: String },
    price: { type: String },
    active: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);
const House = model("House", houseSchema);

module.exports = House;
