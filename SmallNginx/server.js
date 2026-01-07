let http = require("http");
let fs = require("fs");
let path = require("path");
const { error } = require("console");
let port = 3000;
let server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url == "/" ? "index.html" : req.url);
  let extension = path.extname(filePath).toString().toLowerCase();
  let mimeType = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
  };
  let contentType = mimeType[extension] || "application/octet-stream";
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404! Page not found my nigga");
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
