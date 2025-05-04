import dotenv from "dotenv";
import { ChatZhipuAI } from "@langchain/community/chat_models/zhipuai";

// 从.env文件中加载环境变量
dotenv.config();

// 创建一个 LLM对象，并设置相关参数
const llm = new ChatZhipuAI({
    model: "glm-4-plus", // 
    temperature: 0,
    zhipuAIApiKey: process.env.ZHIPUAI_API_KEY
});

// const response = await llm.invoke("你是谁？");
// console.log(response)

import { ChatPromptTemplate } from "@langchain/core/prompts";

// 创建提示词模版
const promptTemplate = ChatPromptTemplate.fromMessages([
    // 开局的限定性语句，你是一个助手
    ["system", "You are a helpful assistant"],
    // 我输入的限定性内容
    ["user", "Tell me a joke about {topic}"],
]);

// 使用模版并未使用到llm，需要将templete -> llm -> invoke
// pipe管道，runnables sequence 前面的输入是后面的输入
const chain = promptTemplate.pipe(llm);

const response = await chain.invoke({
    topic: "dog"
});

// console.log(response);
console.log('type of chain', typeof chain);
console.log('chain', chain)