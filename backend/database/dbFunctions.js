const mongoose = require("mongoose");

function connect() {
  mongoose.connect(process.env.DB_URI).then((data) => {
    console.log(`Mongodb connected with server: ${data.connection.host}`);
  });
}

module.exports.connect = connect;

//Catch block has been removed.
//previously catch block was responsible for handling Promise rejection so now the rejection is unhandled
//this unhandled promise rejection is now being dealt with in server.js.
