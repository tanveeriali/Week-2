const request = require("supertest");

const server = require("../server");
const testUtils = require("../test-utils");

describe("/calendars/:calendarid/events", () => {
  let testCal;
  beforeAll(testUtils.connectDB);

  beforeEach(async () => {
    testCal = (
      await request(server).post("/calendars").send({ name: "Testing" })
    ).body;
  });

  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  describe("GET /calendars/:calendarid/events/", () => {
    it("should return 404 if no matching calendar id or id", async () => {
      const res = await request(server).get("/events/");
      expect(res.statusCode).toEqual(404);
    });
  });
  describe("GET /calendars/:calendarid/events/:id", () => {
    it("should return 404 if no matching calendar id or id", async () => {
      const res = await request(server).get(
        "/calendars/" + testCal._id + "/events/id1"
      );
      expect(res.statusCode).toEqual(404);
    });
  });
  describe("POST /calendars/:calendarid/events/", () => {
    it("should return a 400 without a provided name", async () => {
      const res = await request(server)
        .post("/calendars/" + testCal._id + "/events/")
        .send({});
      expect(res.statusCode).toEqual(400);
    });
  });

  describe("GET /calendars/:calendarid/events/:id after multiple POST /", () => {
    let event1, event2;

    beforeEach(async () => {
      event1 = (
        await request(server)
          .post("/calendars/" + testCal._id + "/events")
          .send({ name: "Sleep", calendar: testCal._id })
      ).body;
      event2 = (
        await request(server)
          .post("/calendars/" + testCal._id + "/events")
          .send({ name: "Generic Event", calendar: testCal._id })
      ).body;
    });

    it("should return event1 using its id", async () => {
      const res = await request(server).get(
        "/calendars/" + testCal._id + "/events/" + event1._id
      );
      expect(res.statusCode).toEqual(200);
      const storedCalendar = res.body;
      expect(storedCalendar).toMatchObject({
        name: "Sleep",
        _id: event1._id,
      });
    });

    it("should return event2 using its id", async () => {
      const res = await request(server).get(
        "/calendars/" + testCal._id + "/events/" + event2._id
      );
      expect(res.statusCode).toEqual(200);
      const storedCalendar = res.body;
      expect(storedCalendar).toMatchObject({
        name: "Generic Event",
        _id: event2._id,
      });
    });
  });

  describe("GET /calendars/:calenderid/events after multiple POST /", () => {
    let event1, event2;

    beforeEach(async () => {
      event1 = (
        await request(server)
          .post("/calendars/" + testCal._id + "/events")
          .send({ name: "event1", calendar: testCal._id })
      ).body;
      event2 = (
        await request(server)
          .post("/calendars/" + testCal._id + "/events")
          .send({ name: "event2", calendar: testCal._id })
      ).body;
    });

    it("should return all calendars", async () => {
      const res = await request(server).get(
        "/calendars/" + testCal._id + "/events/"
      );
      expect(res.statusCode).toEqual(200);
      const storedCalendars = res.body;
      expect(storedCalendars).toMatchObject([event1, event2]);
    });
  });

  describe("PUT /calendars/:calenderid/events/:id after POST /", () => {
    let event1;

    beforeEach(async () => {
      event1 = (
        await request(server)
          .post("/calendars/" + testCal._id + "/events/")
          .send({ name: "Event", calendar: testCal._id })
      ).body;
    });

    it("should store and return event1 with new name", async () => {
      const res = await request(server)
        .put("/calendars/" + testCal._id + "/events/" + event1._id)
        .send({ name: "new name" });
      expect(res.statusCode).toEqual(200);

      const storedCalendar = (
        await request(server).get(
          "/calendars/" + testCal._id + "/events/" + event1._id
        )
      ).body;
      expect(storedCalendar).toMatchObject({
        name: "new name",
        _id: event1._id,
      });
    });
  });

  describe("DELETE /calendars/:calenderid/events/:id after POST /calendars/:calenderid/events/", () => {
    let event1;

    beforeEach(async () => {
      event1 = (
        await request(server)
          .post("/calendars/" + testCal._id + "/events/")
          .send({ name: "event1", calendar: testCal._id })
      ).body;
    });

    it("should delete and not return event1 on next GET", async () => {
      const res = await request(server).delete(
        "/calendars/" + testCal._id + "/events/" + event1._id
      );
      expect(res.statusCode).toEqual(200);
      const storedCalendarResponse = await request(server).get(
        "/calendars/" + testCal._id + "/events/" + event1._id
      );
      expect(storedCalendarResponse.status).toEqual(404);
    });
  });
});
