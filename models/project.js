import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  technologies: {
    type: String,
  },
  skills: {
    frontend: {
      type: String,
    },
    backend: {
      type: String,
    },
    infrastructure: {
      type: String,
    },
    database: {
      type: String,
    },
  },
});

const Project = mongoose.model("project", projectSchema);
export default Project;
