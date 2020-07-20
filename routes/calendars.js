const { Router } = require("express");
const router = Router();

const CalendarDAO = require("../daos/calendars");

router.post("/", async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).send('body parameter "name" is required"');
  } else {
    const calendar = await CalendarDAO.create(name);
    res.json(calendar);
  }
});

router.get("/:id", async (req, res, next) => {
  const calendar = await CalendarDAO.getById(req.params.id);
  if (calendar) {
    res.json(calendar);
  } else {
    res.sendStatus(404);
  }
});
router.get("/", async (req, res, next) => {
  const { filters } = req.body;
  const calendar = await CalendarDAO.getAll({ filters });
  if (calendar) {
    res.json(calendar);
  } else {
    res.sendStatus(404);
  }
});
router.delete("/:id", async (req, res, next) => {
  const calendar = await CalendarDAO.deleteById(req.params.id);
  if (calendar) {
    res.json(calendar);
  } else {
    res.sendStatus(404);
  }
});

router.put("/:id", async (req, res, next) => {
  const name = req.body;
  const id = req.params.id;

  if (!name || JSON.stringify(name) === "{}") {
    res.status(400).send('name is required"');
  } else {
    const calendar = await CalendarDAO.updateById(id, name);
    res.json(calendar);
  }
});

module.exports = router;
