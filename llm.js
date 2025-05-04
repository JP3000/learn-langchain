import dotenv from "dotenv";
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

const model = new ChatOpenAI({
    modelName: "THUDM/GLM-4-32B-0414",
    configuration: {
        baseURL: process.env.SILICONFLOW_API_URL,
        apiKey: process.env.SILICONFLOW_API_KEY,
    }
});

const response = await model.invoke("Who are you?");
console.log(response)
