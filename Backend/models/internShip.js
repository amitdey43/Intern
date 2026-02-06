import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Internship title is required"],
    trim: true,
  },
  mode:{
    type:String,
    required: [true, "Mode of internship is required"],
    enum:["Online","Offline","Hybrid"]
  },
  department: {
    type: String,
    // required: [true, "Department is required"],
    enum: [
      "Engineering",
      "Marketing",
      "HR",
      "Design",
      "Sales",
      "Finance",
      "Operations",
      "Customer Support",
      "Content Writing",
      "Data Science",
      "R&D",
      "Product Management",
      "Legal",
      "Supply Chain",
      "Education"
    ],
  },
  companyname:{
    type:String,
  },
  domain: {
    type:String,
    required: [true, "Domain is required"],
  },
  skills: {
    type: [String],
    required: [true, "At least one skill requirement is needed"],
  },
  stipend:{
    type:Number,
    required: [true, "Intership Stipend is required"],
  },
  numberOfOpenings: {
    type: Number,
    required: [true, "Number of openings is required"],
    min: [1, "Number of openings must be at least 1"],
  },
  duration: {
    type:Number,
    required: [true,"Internship duration is required"]
  },
  city:{
    type:String,
    required: [true,"City field is required"]
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
    validate: {
      validator: function(value) {
        return !this.startDate || value >= this.startDate;
      },
      message: "End date must be after start date",
    },
  },
  userApplied:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    // maxlength: [1000, "Description can't exceed 1000 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HR",
  },
});

export const internshipModel = mongoose.model("Internship", internshipSchema);


