module.exports = (app) => {
  app.get("/admin", (req, res) => {
    res.send("Painel administrativo");
  });
};
