let assert = require("assert");
var express = require("express");
var router = express.Router();
let restify = require("restify-clients");

let client = restify.createJSONClient({
  url: "http://localhost:4000",
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  client.get("/users", function (err, request, respost, obj) {
    assert.ifError(err);

    res.json(obj);
  });
});
router.get("/:id", function (req, res, next) {
  client.get(`/users/${req.params.id}`, function (err, request, respost, obj) {
    assert.ifError(err);

    res.json(obj);
  });
});
router.post("/", function (req, res, next) {
  client.post("/users", req.body, function (err, request, respost, obj) {
    assert.ifError(err);

    res.json(obj);
  });
});
router.put("/:id", function (req, res, next) {
  client.put(
    `/users/${req.params.id}`,
    req.body,
    function (err, request, respost, obj) {
      assert.ifError(err);

      res.json(obj);
    }
  );
});
router.delete("/:id", function (req, res, next) {
  client.del(`/users/${req.params.id}`, function (err, request, respost, obj) {
    assert.ifError(err);

    res.json(obj);
  });
});

module.exports = router;
