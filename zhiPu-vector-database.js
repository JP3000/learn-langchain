import dotenv from "dotenv";
import { ChatZhipuAI } from "@langchain/community/chat_models/zhipuai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// 从.env文件中加载环境变量
dotenv.config();

// 创建一个 LLM对象，并设置相关参数
const llm = new ChatZhipuAI({
    model: "glm-4-plus",
    temperature: 1,
    zhipuAIApiKey: process.env.ZHIPUAI_API_KEY
});

// 使用异步函数封装主逻辑

const file_path = "./data/bitcoin.pdf";
const loader = new PDFLoader(file_path);
let docs = await loader.load(); // 使用 let 代替 const（后续会重新赋值）

// 文档切片设置
const text_splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    lengthFunction: (doc) => doc.length
});

// 分割文档并重新赋值给 docs
docs = await text_splitter.splitDocuments(docs);

// 加载embedding模型
import { ZhipuAIEmbeddings } from "@langchain/community/embeddings/zhipuai";
const embeddings_model = new ZhipuAIEmbeddings({});

// 将文档的嵌入式向量存储到数据库中
import { Chroma } from "@langchain/community/vectorstores/chroma";
const vectorStore = await Chroma.fromDocuments(docs, embeddings_model);
const query = "比特币的价格是什么"
const results = await vectorStore.similaritySearch(query, 5);
console.log(results[0].pageContent);
