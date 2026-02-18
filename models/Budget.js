// models/Budget.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const budgetSchema = new Schema({
  user:           { type: Schema.Types.ObjectId, ref: "User", required: true },
  name:           { type: String, required: true },
  income:         { type: Number, required: true },
  needsPercent:   { type: Number, default: 50 },
  wantsPercent:   { type: Number, default: 30 },
  savingsPercent: { type: Number, default: 20 },
  createdAt:      { type: Date, default: Date.now }
});

export default mongoose.model("Budget", budgetSchema);