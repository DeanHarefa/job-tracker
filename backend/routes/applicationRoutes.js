
const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");


// CREATE
router.post("/", authMiddleware, async (req, res) => {
try {
const newApp = new Application({
...req.body,
userId: req.user.id,
status: "Sedang diproses", // default status
statusUpdatedAt: null, // no status change yet
});
await newApp.save();
res.json(newApp);
} catch (err) {
res.status(500).json({ msg: err.message });
}
});

// READ (list all user applications)
router.get("/", authMiddleware, async (req, res) => {
try {
const apps = await Application.find({ userId: req.user.id }).sort({ updatedAt: -1 });
res.json(apps);
} catch (err) {
res.status(500).json({ msg: err.message });
}
});

// READ (single)
router.get("/:id", authMiddleware, async (req, res) => {
try {
const app = await Application.findOne({ _id: req.params.id, userId: req.user.id });
if (!app) return res.status(404).json({ msg: "Application not found" });
res.json(app);
} catch (err) {
res.status(500).json({ msg: err.message });
}
});

// UPDATE (general). If status changes, set statusUpdatedAt.
router.put("/:id", authMiddleware, async (req, res) => {
try {
const app = await Application.findOne({ _id: req.params.id, userId: req.user.id });
if (!app) return res.status(404).json({ msg: "Application not found" });


const updates = { ...req.body };


// Only mark statusUpdatedAt when the STATUS actually changes
if (
Object.prototype.hasOwnProperty.call(req.body, "status") &&
req.body.status &&
req.body.status !== app.status
) {
updates.statusUpdatedAt = new Date();
}


const updated = await Application.findOneAndUpdate(
{ _id: req.params.id, userId: req.user.id },
{ ...updates },
{ new: true }
);


res.json(updated);
} catch (err) {
res.status(500).json({ msg: err.message });
}
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
try {
const deleted = await Application.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
if (!deleted) return res.status(404).json({ msg: "Application not found" });


res.json({ msg: "Application deleted" });
} catch (err) {
res.status(500).json({ msg: err.message });
}
});

// TOGGLE BOOKMARK
router.put("/:id/bookmark", authMiddleware, async (req, res) => {
try {
const app = await Application.findOne({ _id: req.params.id, userId: req.user.id });
if (!app) return res.status(404).json({ msg: "Application not found" });


app.bookmarked = !app.bookmarked;
await app.save();


res.json(app);
} catch (err) {
res.status(500).json({ msg: err.message });
}
});

module.exports = router;