import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts"

import {
    StringOutputParser,
    CommaSeparatedListOutputParser,
    StructuredOutputParser
} from "@langchain/core/output_parsers"

import { z } from "zod"

import * as dotenv from "dotenv"
import { ignoreOverride } from "openai/_vendor/zod-to-json-schema/Options.mjs"
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

async function callStringOutputParser() {
    // Create prompt template by fromMessages
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "Generate a joke based on a word provided by the user."],
        ["human", "{input}"],
    ]);

    // Create output parser
    const parser = new StringOutputParser()

    // Create chain
    const chain = prompt.pipe(model).pipe(parser);

    // call chain
    return await chain.invoke({
        input: "dog",
    })
}

async function callListOutputParser() {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Provide 5 synonyms, seperated by commas. for the following word {word}
    `)

    const outputParser = new CommaSeparatedListOutputParser()

    const chain = prompt.pipe(model).pipe(outputParser)

    return await chain.invoke({
        word: "happy"
    })
}

// structured output parser
async function callStructuredParser() {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following.
        Formatting Instructions: {format_instructions}
        phrase: {phrase}
    `)

    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
        name: "the name of the person",
        age: "the age of the person",
    })

    const chain = prompt.pipe(model).pipe(outputParser)

    return await chain.invoke({
        phrase: "John is 30 years old",
        format_instructions: outputParser.getFormatInstructions(),
    })
}

async function callZodOutputParser() {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following phrase.
        formatting instructions: {format_instructions}
        phrase: {phrase}
    `);

    const outputParser = StructuredOutputParser.fromZodSchema(
        z.object({
            recipe: z.string().describe("name of recipe"),
            ingredients: z.array(z.string()).describe("ingredients"),
        })
    );

    const chain = prompt.pipe(model).pipe(outputParser);

    return await chain.invoke({
        phrase: "The ingreadients for a Spaghetti Bolognese recipe are spaghetti, ground beef, tomato sauce, and parmesan cheese.",
        format_instructions: outputParser.getFormatInstructions(),
    })

}

// const response = await callStringOutputParser();
// const response = await callListOutputParser();
// const response = await callStructuredParser();
const response = await callZodOutputParser();
console.log(response);
