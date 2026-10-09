const spinalcore = require("spinal-core-connectorjs");
const { configFile } = require("./dist")

const protocol = "http"; // user id
const user = 168; // user id
const password = "u2H4U5yfwN5Tw4"; // user password
const host = "127.0.0.1"; // can be an ip address
const port = 8010;

let connect_opt = `${protocol}://${user}:${password}@${host}:${port}`;
const connect = spinalcore.connect(connect_opt);


configFile.init(connect, "configFileName", "type", "serverName", port).then((file) => {
    console.log("Config file initialized:", file);
});