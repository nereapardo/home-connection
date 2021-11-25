const { Schema, model } = require("mongoose");

const houseSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    area: { type: Number, required: true },
    rooms: { type: Number, required: true },
    photo: { type: String },
    public_id: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    active: { type: Boolean, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
const House = model("House", houseSchema);

module.exports = House;
