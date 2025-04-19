import dotenv from "dotenv";
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

const model = new ChatOpenAI({
    modelName: "Qwen/QwQ-32B",
    configuration: {
        baseURL: process.env.SILICONFLOW_API_URL,
        apiKey: process.env.SILICONFLOW_API_KEY,
    }
});

const response = await model.invoke('Who are you?');
console.log(response)
