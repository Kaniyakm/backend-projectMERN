// models/Expense.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const expenseSchema = new Schema({
  user:     { type: Schema.Types.ObjectId, ref: "User",   required: true },
  budget:   { type: Schema.Types.ObjectId, ref: "Budget", required: true },
  title:    { type: String, required: true },
  amount:   { type: Number, required: true },
  category: { type: String },
  group:    { type: String, enum: ["Needs", "Wants", "Savings"] },
  date:     { type: Date, default: Date.now }
});

export default mongoose.model("Expense", expenseSchema);
