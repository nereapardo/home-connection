const { Schema, model } = require("mongoose");

const houseSchema = new Schema(
  {
    Title: { type: String, required: true },
    Location: { type: String, required: true },
    Area: { type: String, required: true },
    Rooms: { type: String, required: true },
    Photos: [{ type: String }],
    Description: { type: String },
    Price: { type: String },
    Active: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);
