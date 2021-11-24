const router = require("express").Router();
const House = require("../models/House.model");

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    const housesList = await House.find();
    let locationList = [""];
    housesList.forEach((house) => {
      console.log("each house", house.location);
      if (locationList.includes(house.location)) return;
      locationList.push(house.location);
      return locationList;
    });
    res.render("index", { locationList });
  } catch (error) {
    console.log(error);
  }
});
//TODO: add a filter by city
module.exports = router;
