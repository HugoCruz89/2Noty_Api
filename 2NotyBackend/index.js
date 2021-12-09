const express = require("express");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const config = require("./configs/config");
const cors = require("cors");
const app = express();

const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");

app.use(cors());
app.use(
  fileUpload({
    limits: {
      fileSize: 2 * 1024 * 1024 * 1024, //2MB max file(s) size
    },
  })
);
app.set("llave", config.llave);
// Directorio Público
app.use(express.static("public"));

// Lectura y parceo del body
app.use(express.json());

//RUTAS
app.use("/api/auth", require("./routes/auth"));
app.use("/api/catalogs", require("./routes/catalogs"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/subscriptions", require("./routes/subscritions"));
app.use("/api/subscribers", require("./routes/subcribers"));
app.use("/api/user", require("./routes/user"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/menus", require("./routes/menu"));
app.use("/api/agend",require("./routes/agend"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo ${process.env.PORT} `);
});
