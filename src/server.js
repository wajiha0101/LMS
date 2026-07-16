require("dotenv").config();

const app = require("./app");

const port = parseInt(process.env.PORT ?? "4000", 10);

app.listen(port, () => {
  console.log(`LMS backend listening on port ${port}`);
});
