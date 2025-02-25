const express = require("express");
const { 
  createClub,
  getAllClubs,
  getClub,
  updateClub,
  deleteClub
} = require("../controllers/clubController");
const router = express.Router();

router.post("/", createClub);
router.get("/", getAllClubs);
router.get("/:id", getClub);
router.put("/:id", updateClub);
router.delete("/:id", deleteClub);

module.exports = router;