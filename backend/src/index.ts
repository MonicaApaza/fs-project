const app = require("./app");

const PORT = process.env.PORTT || 1234;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
