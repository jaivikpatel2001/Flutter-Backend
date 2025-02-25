const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Club", clubSchema);

/*
Postman Testing Data for CRUD Operations:

1. Create Club (POST /api/clubs)
{
    "name": "Manchester United",
    "location": "Old Trafford, Manchester"
}

2. Get All Clubs (GET /api/clubs)
No body needed

3. Get Single Club (GET /api/clubs/:id)
No body needed, replace :id with actual club ID

4. Update Club (PUT /api/clubs/:id)
{
    "name": "Updated Club Name",
    "location": "Updated Location"
}
Replace :id with actual club ID

5. Delete Club (DELETE /api/clubs/:id)
No body needed, replace :id with actual club ID
*/
