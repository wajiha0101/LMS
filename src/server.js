require("dotenv").config();

const App = require("./app");

const Port = parseInt(process.env.PORT ?? "4000", 10);

App.listen(Port, () => {
  console.log(`LMS backend listening on port ${Port}`);
});
