const { Router } = require("express");
const router = Router();

router.use("/calendars", require("./calendars"));

router.use("/calendars", require("./events"));

module.exports = router;
