const mongoose = require("mongoose");

const ConnectDB = async () => {
    try {
        const launchConnection = await mongoose.connect(process.env.DB_LINK)
        console.log("Database connection established :", 
            launchConnection.connection.host,
            launchConnection.connection.port,
            launchConnection.connection.name
        );
    } catch (error) {
        console.log("Database Error :", error);
        process.exit(1);
    }
}

module.exports = ConnectDB;