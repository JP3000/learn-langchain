import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts"

import * as dotenv from "dotenv"
dotenv.config()

//Create model 
const model = new ChatOpenAI({
    modelName: "deepseek-ai/deepseek-vl2",
    temperature: 0.7,
    configuration: {
        baseURL: process.env.SILICONFLOW_API_URL,
        apiKey: process.env.SILICONFLOW_API_KEY,
    }
})

// Create prompt template by fromTemplate
// const prompt = ChatPromptTemplate.fromTemplate("You are a comedian. Tell a joke based on the following word {input}")

// Create prompt template by fromMessages
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Generate a joke based on a word provided by the user."],
    ["human", "{input}"],
]);

// console.log(await prompt.format({ input: "chiken" }))

// Create chain
const chain = prompt.pipe(model);

// call chain
const response = await chain.invoke({
    input: "dog",
})

console.log(response);
