const nedb = require("nedb");
const { check, validationResult } = require("express-validator");

let db = new nedb({
  filename: "user.db",
  autoload: true,
});

module.exports = (app) => {
  let route = app.route("/users");

  //Read
  route.get((req, res) => {
    db.find({})
      .sort({ name: 1 })
      .exec((error, users) => {
        if (error) {
          app.utils.error.send(error, req, res);
        } else {
          res.status(200).json(users);
        }
      });
  });

  //Insert
  route.post(
    [
      check("_name", "O nome é obrigatório").notEmpty(),
      check("_email", "O e-mail é inválido").notEmpty().isEmail(),
    ],
    (req, res) => {
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        app.utils.error.send(errors, req, res);
        return false;
      }

      db.insert(req.body, (error, users) => {
        if (error) {
          app.utils.error.send(error, req, res);
        } else {
          res.status(200).json(users);
        }
      });
    }
  );

  let routeId = app.route("/users/:id");

  //Read One
  routeId.get((req, res) => {
    db.findOne({ _id: req.params.id }).exec((error, users) => {
      if (error) {
        app.utils.error.send(error, req, res);
      } else {
        res.status(200).json(users);
      }
    });
  });

  //Upadate
  routeId.put((req, res) => {
    db.update({ _id: req.params.id }, req.body, (error) => {
      if (error) {
        app.utils.error.send(error, req, res);
      } else {
        res.status(200).json(Object.assign({}, req.params, req.body));
      }
    });
  });

  //Delete
  routeId.delete((req, res) => {
    db.remove({ _id: req.params.id }, {}, (error) => {
      if (error) {
        app.utils.error.send(error, req, res);
      } else {
        res.status(200).json(req.params);
      }
    });
  });
};
