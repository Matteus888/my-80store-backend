const mongoose = require("mongoose");

const connectionString = process.env.MONGODB_CONNECTION_STRING;

if (!connectionString) {
  console.error("❌ MongoDB connection string is missing.");
  process.exit(1);
}

const options = {
  connectTimeoutMS: 2000,
  serverSelectionTimeoutMS: 2000,
};

mongoose
  .connect(connectionString, options)
  .then(() => {
    console.log("✅ my-80store database connected");
  })
  .catch((error) => {
    console.error("❌ Error to connect database", error);
    setTimeout(() => {
      mongoose.connect(connectionString, options);
    }, 2000);
  });

mongoose.set("debug", false);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
