"use strict";
const http = require("http");
const url = require("url");
const fs = require("fs");
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

    if (entry === "writeFile") {
      fs.writeFile("file.txt", query["text"], (err) => {
        if (err) {
          res.writeHead(404, {"Content-Type": "text/html"});
          return res.end("Fail to write file");
        } else {
          res.writeHead(200, {"Content-Type": "text/html"});
          return res.end("File Created");
        }
      });
    } else if (entry === "readFile") {
      const fileName = pathname.split("/")[5];
      fs.readFile(fileName, (err, data) => {
        if (err) {
          res.writeHead(404, {"Content-Type": "text/html"});
          return res.end(`Fail to read ${fileName}`);
        } else {
          res.writeHead(200, {"Content-Type": "text/html"});
          return res.end(data);
        }
      });
    } else {
      return res.end("Nothing to show in this page :)");
    }
  })
  .listen(PORT);

console.log(`Server is on ${PORT}`);
