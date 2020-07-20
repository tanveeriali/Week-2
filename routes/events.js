const { Router } = require("express");
const router = Router();

const EventDAO = require("../daos/events");

router.post("/:calendarId/events/", async (req, res, next) => {
  const { name, calendar } = req.body;
  const date = !req.body.date ? new Date() : req.body.date;
  if (!name) {
    res.status(400).send('body parameter "name" is required"');
  } else if (!calendar) {
    res.status(400).send('body parameter "calendar" is required"');
  } else {
    const event = await EventDAO.create(name, calendar, date);
    res.json(event);
  }
});

router.get("/:calendarId/events/:id", async (req, res, next) => {
  const calendarId = req.params.calendarId;
  const event = await EventDAO.getById(req.params.id, calendarId);
  if (event) {
    res.json(event);
  } else {
    res.sendStatus(404);
  }
});
router.get("/:calendarId/events/", async (req, res, next) => {
  const calendarId = req.params.calendarId;
  const event = await EventDAO.getAll(calendarId);
  if (event) {
    res.json(event);
  } else {
    res.sendStatus(404);
  }
});

router.delete("/:calendarId/events/:id", async (req, res, next) => {
  const event = await EventDAO.deleteById(req.params.id, req.params.calendarId);
  if (event) {
    res.json(event);
  } else {
    res.sendStatus(404);
  }
});

router.put("/:calendarId/events/:id", async (req, res, next) => {
  const name = req.body;
  const id = req.params.id;
  const calendarId = req.params.calendarId;

  if (!name || JSON.stringify(name) === "{}") {
    res.status(400).send('name is required"');
  } else {
    const event = await EventDAO.updateById(id, name, calendarId);
    res.json(event);
  }
});

module.exports = router;
