/*****************************************************************************************
 FILE: models/Project.js
 PURPOSE:
 Defines Project schema—extended with category + amount
 for dashboard analytics and 50/30/20 spending charts.
*****************************************************************************************/
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ["needs", "wants", "investment"],
      default: "needs",
    },
    amount: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
