import dotenv from "dotenv";
import { ChatZhipuAI } from "@langchain/community/chat_models/zhipuai";

// 从.env文件中加载环境变量
dotenv.config();

// 创建一个 LLM对象，并设置相关参数
const llm = new ChatZhipuAI({
    model: "glm-4-plus", // 
    temperature: 1,
    zhipuAIApiKey: process.env.ZHIPUAI_API_KEY
});

const response = await llm.invoke("Who are you?");
console.log(response)
