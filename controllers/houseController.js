const House = require("../models/House");
const uuid = require("uuid");
const Service = require("../models/Service");
const fs = require("fs");
const path = require("path");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
  // Search houses with filters (POST method)
  searchHouses: async (req, res) => {
    try {
      console.log(req.body);
      const {
        location,
        amenities,
        dateRange,
        rating,
        pagination = { page: 1, limit: 8 },
        guests,
      } = req.body;

      // Build base match query
      let matchQuery = {};

      // Location filter
      if (location) {
        matchQuery.location = {
          $regex: location.trim(),
          $options: "i",
        };
      }

      // Date range availability filter - check if house is not booked during the requested dates
      if (dateRange?.start_date && dateRange?.end_date) {
        matchQuery["bookings"] = {
          $not: {
            $elemMatch: {
              $and: [
                { start_date: { $lt: new Date(dateRange.end_date) } },
                { end_date: { $gt: new Date(dateRange.start_date) } }
              ]
            }
          }
        };
      } else if (dateRange?.start_date) {
        matchQuery["bookings"] = {
          $not: {
            $elemMatch: { start_date: { $lt: new Date(dateRange.start_date) } },
          },
        };
      } else if (dateRange?.end_date) {
        matchQuery["bookings"] = {
          $not: {
            $elemMatch: { end_date: { $gt: new Date(dateRange.end_date) } },
          },
        };
      }

      // Amenities filter - ensure house has ALL requested amenities
      if (amenities && amenities.length > 0) {
        matchQuery.amenities = {
          $all: amenities.map((amenity) => new ObjectId(amenity)),
        };
      }

      // Calculate skip value for pagination
      const skip = (pagination.page - 1) * pagination.limit;
      const total = totalCount.length > 0 ? totalCount[0].total : 0;

      return res.status(200).json({
        status: "success",
        data: {
          houses,
          pagination: {
            total,
            current_page: Number(pagination.page),
            per_page: Number(pagination.limit),
            total_pages: Math.ceil(total / pagination.limit),
          },
        },
      });
    } catch (error) {
      console.error("Search houses error:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to search houses",
      });
    }
  },

  // Get house details with owner profile
 
};
