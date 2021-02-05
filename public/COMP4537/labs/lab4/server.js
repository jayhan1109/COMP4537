"use strict";
const http = require("http");
const url = require("url");
const getDate = require("./modules/utils");

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

    // when file path has 'getDate'
    if (entry === "getDate") {
      return res.end(getDate(query["name"])); // returns current date
    } else { // redirects user to another page
      return res.end("Wanna try to <a href='https://jayhan-lab4.herokuapp.com/COMP4537/labs/4/getDate/?name=Jay'>check time?</a>");
    }
  })
  .listen(PORT); // listening to port

console.log(`Server is on ${PORT}`);
