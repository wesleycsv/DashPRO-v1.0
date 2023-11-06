const express = require("express");
const consign = require("consign");

const app = express();
app.use(express.json({ limit: "50mb" }));

consign().include("routes").include("utils").into(app);

app.listen(4000, () => console.log("Serviror Rodando na porta 4000"));
