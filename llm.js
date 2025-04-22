import dotenv from "dotenv";
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

const model = new ChatOpenAI({
    modelName: "deepseek-ai/deepseek-vl2",
    configuration: {
        baseURL: process.env.SILICONFLOW_API_URL,
        apiKey: process.env.SILICONFLOW_API_KEY,
    }
});

const response = await model.invoke("write a poem about the AI");
console.log(response)
