const mongoose = require("mongoose");

const seederStatusSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  isSeeded: { type: Boolean, default: false },
});

const SeederStatus = mongoose.model("SeederStatus", seederStatusSchema);

const checkSeederStatus = async () => {
  try {
    let seederStatus = await SeederStatus.findOne({ name: "initial_seeder" });

    if (!seederStatus) {
      console.log("Running seeders for the first time...");

      // Run seeders
      await require("./createUsers")();
      await require("./createCategory")();
      await require("./createPermission")();
      await require("./createProduct")();

      // Mark seeder as completed
      await SeederStatus.create({ name: "initial_seeder", isSeeded: true });
      console.log("Seeders executed successfully!");
    } else {
      console.log("Seeders already run, skipping...");
    }
  } catch (error) {
    console.error("Error checking seeder status:", error);
  }
};

module.exports = checkSeederStatus;
