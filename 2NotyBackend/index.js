const express = require("express");
require("dotenv").config();
const config = require("./configs/config");
const cors = require("cors");
const app = express();

const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");

app.use(cors());

app.set("llave", config.llave);
// Directorio Público
app.use(express.static("public"));

// Lectura y parceo del body
app.use(express.json());

//RUTAS
app.use("/api/auth", require("./routes/auth"));
app.use("/api/catalogs", require("./routes/catalogs"));
app.use("/api/notifications", require("./routes/notifications"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo ${process.env.PORT} `);
});
