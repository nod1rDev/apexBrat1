const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Video title is required"],
    trim: true,
  },
  genre: {
    type: String,
    required: function() { return this.isFilm; }, // 'genre' is required only if isFilm is true
    trim: true,
  },
  imgUrl: {
    type: String,
    required: [true, "Video image URL is required"],
    trim: true,
  },
  duration: {
    type: Number, // in seconds
    required: function() { return this.isFilm; }, // 'duration' is required only if isFilm is true
  },
  description: {
    type: String,
    required: [true, "Video description is required"],
    trim: true,
  },
  releaseDate: {
    type: Date,
    required: function() { return this.isFilm; }, // 'releaseDate' is required only if isFilm is true
  },
  rating: {
    type: Number,
    min: [0, "Rating cannot be less than 0"],
    max: [10, "Rating cannot be more than 10"],
    default: 0,
    required: function() { return this.isFilm; }, // 'rating' is required only if isFilm is true
  },
  filePath: {
    type: String,
    required: function() { return this.isFilm; }, // 'filePath' is required only if isFilm is true
  },
  isFilm: {
    type: Boolean,
    default: false, // Default to false if not provided
  },
});

// Virtual field to return duration in hours and minutes
videoSchema.virtual("formattedDuration").get(function() {
  if (this.duration) {
    const hours = Math.floor(this.duration / 3600); // Convert seconds to hours
    const minutes = Math.floor((this.duration % 3600) / 60); // Convert remaining seconds to minutes
    return `${hours}h ${minutes}m`;
  }
  return "0h 0m"; // Default if no duration is provided
});

// Apply the virtual to the model's output
videoSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id; // Optionally remove _id from the returned object
    delete ret.__v; // Optionally remove __v
  },
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
