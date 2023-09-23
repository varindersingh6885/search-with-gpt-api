import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";
import { projectList } from "./utils/dummyData.js";

dotenv.config();
const app = express();

app.use(cors());

const openai = new OpenAI({
  apiKey: "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", // This is also the default, can be omitted
});

app.get("/projects", async (req, res) => {
  const { searchQuery } = req.query;
  if (searchQuery) {
    const result = await processWithChatGPT(searchQuery);
    res.send(result);
  } else {
    res.send({ data: projectList });
  }
});

async function processWithChatGPT(prompt) {
  const x = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages: [
      { role: "system", content: "Consider the following array of projects" },
      { role: "system", content: JSON.stringify(projectList.slice(0, 80)) },
      {
        role: "user",
        content: prompt,
      },
      {
        role: "system",
        content: "Output format: '[<project_title1>, <project_title2>, ...]'",
      },
    ],
  });

  const matchingProjects = x.choices[0].message.content;

  const filteredProjects = projectList.filter((project) => {
    return matchingProjects.includes(project.title);
  });

  console.log(filteredProjects);

  return { data: filteredProjects };
  // const prompt = projectDescriptions.join('\n'); // Join descriptions into a single text
  // const completion = await openai.completions.create({
  //   model: "gpt-3.5-turbo-0613",
  //   prompt: prompt,
  //   max_tokens: 30,
  // });
  // console.log(completion);
  // return completion.choices[0].text;
}
const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
