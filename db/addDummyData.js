import dotenv from "dotenv";
import { dbConnect } from "./db.js";
import { projectList } from "../utils/dummyData.js";
import Project from "../models/project.js";

dotenv.config();

await dbConnect();

const addDummyDataToDB = async () => {
  const projects = await Project.insertMany(projectList);
};

addDummyDataToDB();
