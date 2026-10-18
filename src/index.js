const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Mount all application routes
app.use("/api", routes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = app;