const router = require("express").Router();
const Properties = require("../models/Properties");

router.get("/allProperties", async (req, res) => {
  try {
    const properties = await Properties.find();
    res.status(200).json({ properties });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
