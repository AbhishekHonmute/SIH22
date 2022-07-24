const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/database");
const { urlencoded } = require("express");

const PORT = process.env.PORT || 5000;

const routes = [
  "auth",
  "member",
  "committee",
  "venue",
  "event",
  "cell",
  "canteen",
  "order",
  "fooditem",
];

const app = express();

(async function () {
  await connectDatabase();
})();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(urlencoded({ limit: "50mb", extended: true }));

const httpServer = require("http").createServer(app);

routes.forEach((route) => {
  app.use(`/api/${route}`, require(`./routes/${route}`));
});

httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
