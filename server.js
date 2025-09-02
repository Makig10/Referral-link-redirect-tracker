import handler from "./api/go.js";
import http from "http";
import 'dotenv/config';


const server = http.createServer((req, res) => {
  handler(req, res);
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
