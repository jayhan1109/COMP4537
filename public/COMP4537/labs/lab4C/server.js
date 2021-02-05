"use strict";
const http = require("http");
const url = require("url");
const fs = require("fs");

// port connection
const PORT = process.env.PORT || 3000;

// creates server
http
  .createServer(function (req, res) {
    let q = url.parse(req.url, true);
    
    // sets default page 
    res.writeHead(200, {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": ""
    });

    // sectioned paths
    const pathname = q.pathname;
    const query = q.query;
    const entry = pathname.split("/")[4];

    /* considers all the file paths */

    // writing to local data
    if (entry === "writeFile") {

        // appends the text contents of query paths into a .txt
        fs.appendFile("file.txt", query["text"], (err) => {

        if (err) { // 404 error msg
          res.writeHead(404, {"Content-Type": "text/html"});
          return res.end("Fail to write file");
        } else { // 200 success msg
          res.writeHead(200, {"Content-Type": "text/html"});
          return res.end("Text appended to file");
        }
      });
    // reading from local data
    } else if (entry === "readFile") {
      
      // holds filename
      const fileName = pathname.split("/")[5];

      // reads file contents
      fs.readFile(fileName, (err, data) => {
        if (err) { // 404 error msg
          res.writeHead(404, {"Content-Type": "text/html"});
          return res.end(`Fail to read ${fileName}`);
        } else { // 200 success msg
          res.writeHead(200, {"Content-Type": "text/html"});
          return res.end(data);
        }
      });
    } else { // if path is incorrect
      return res.end("Nothing to show in this page :)");
    }
  })
  .listen(PORT); // listening to port

console.log(`Server is on ${PORT}`);
