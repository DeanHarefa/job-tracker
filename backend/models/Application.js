// const mongoose = require("mongoose");


// const applicationSchema = new mongoose.Schema(
// {
// company: { type: String, required: true },
// position: { type: String, required: true },
// link: { type: String },
// applicationSource: { type: String, default: "Other" },
// status: { type: String, default: "Sedang diproses" },
// bookmarked: { type: Boolean, default: false },
// notes: { type: String, default: "" },


// // NEW: track when status specifically changes
// statusUpdatedAt: { type: Date, default: null },


// userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// },
// { timestamps: true }
// );


// module.exports = mongoose.model("Application", applicationSchema);

const mongoose = require("mongoose");


const applicationSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    link: { type: String },
    applicationSource: { type: String, default: "Other" },
    status: { type: String, default: "Sedang diproses" },
    bookmarked: { type: Boolean, default: false },
    notes: { type: String, default: "" },
    statusUpdatedAt: { type: Date, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);



module.exports = mongoose.model("Application", applicationSchema);
