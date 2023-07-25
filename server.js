import express from "express";
import cors from "cors";
import { config } from "dotenv";

const app = express();
app.use(express.json());

app.use(cors());

config({
  path: "./config.env",
  override: false,
});

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;

app.post("/api", async (req, res) => {
  const userInputs = req.body.inputs.past_user_inputs;
  const generatedResponses = req.body.inputs.generated_responses;
  const userText = req.body.inputs.text;
  console.log("User inputs:", userInputs);
  console.log("Generated responses:", generatedResponses);
  console.log("User input text:", userText);

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: {
        generated_responses: generatedResponses,
        past_user_inputs: userInputs,
        text: userText,
      },
    }),
  };

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      options
    );
    const data = await response.json();
    console.log(data);
    res.send(data);
  } catch (error) {
    console.log(error + " Unable to fetch data!!");
  }
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

// inputs: {
//   generated_responses: [],
//   past_user_inputs: [],
//   text: req.body.message | "hi",
// },
