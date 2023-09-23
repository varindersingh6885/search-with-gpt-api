import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnect } from "./db/db.js";
import Project from "./models/project.js";

dotenv.config();
const app = express();

app.use(cors());

dbConnect();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

app.get("/projects", async (req, res) => {
  const { searchQuery } = req.query;

  const projects = await Project.find().select({ _id: 0, __v: 0 });

  if (searchQuery) {
    const result = await processWithChatGPT(searchQuery, projects);
    res.send({ data: result });
  } else {
    res.send({ data: projects });
  }
});

async function processWithChatGPT(prompt, projects) {
  const x = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k-0613",
    messages: [
      { role: "system", content: "Consider the following array of projects" },
      {
        role: "system",
        content: JSON.stringify(
          projects?.length > 80 ? projects.slice(0, 80) : projects
        ),
      },
      {
        role: "user",
        content: prompt,
      },
      {
        role: "system",
        content:
          "Output in JSON format: '[<project_title1>, <project_title2>, ...]'",
      },
    ],
  });

  const matchingProjectTitles = JSON.parse(x.choices[0].message.content);

  const filteredProjects = projects.filter((project) => {
    return matchingProjectTitles.some((title) => project.title === title);
  });

  return filteredProjects;
}
const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
