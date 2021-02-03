"use strict";
const http = require("http");
const url = require("url");
const getDate = require("./modules/utils");

const PORT = process.env.PORT || 3000;

http
  .createServer(function (req, res) {
    let q = url.parse(req.url, true);
    res.writeHead(200, {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": ""
    });

    const pathname = q.pathname;
    const query = q.query;
    const entry = pathname.split("/")[4];

    if (entry === "getDate") {
      res.end(getDate(query["name"]));
    } else {
      res.end("Wanna try to <a href='https://shielded-refuge-17332.herokuapp.com/COMP4537/labs/4/getDate/?name=Jay '>check time?</a>");
    }

  })
  .listen(PORT);

console.log(`Server is on ${PORT}`);
