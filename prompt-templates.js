import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts"

import * as dotenv from "dotenv"
dotenv.config()

//Create model 
const model = new ChatOpenAI({
    modelName: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    temperature: 0.7,
    configuration: {
        baseURL: process.env.SILICONFLOW_API_URL,
        apiKey: process.env.SILICONFLOW_API_KEY,
    }
})

// Create prompt template
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Generate a joke based on a word provided by the user."],
    ["human", "{input}"],
]);

// console.log(await prompt.format({ input: "chiken" }))

// Create chain
const chain = prompt.pipe(model);

// Invoke chain
const response = await chain.invoke({
    input: "dog",
})

console.log(response);