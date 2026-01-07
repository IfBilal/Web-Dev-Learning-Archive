let fs = require("fs");
let EventEmitter = require("events");
let os = require("os");
let filePath = "./logTxt.txt";

class logger extends EventEmitter {
  log(message) {
    this.emit("message", message);
  }
}
let messageLogger = new logger();

function logMessage(message) {
  fs.appendFileSync(filePath, message);
}

setInterval(() => {
  let message = `${new Date().toISOString()} - Free Memory: ${
    ((os.freemem() / os.totalmem()) * 100).toFixed(1)
  }\n`;
  messageLogger.log(message);
}, 3000);

messageLogger.on("message", logMessage);
