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

const text_splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    lengthFunction: (doc) => doc.length
});

// 分割文档并重新赋值给 docs
docs = await text_splitter.splitDocuments(docs);


// console.log(docs.length, "分割后的文档数量：");
// console.log("分割后的文档内容0：", docs[0]);

// 在切分之后开始embedding
import { ZhipuAIEmbeddings } from "@langchain/community/embeddings/zhipuai";

// 加载embedding模型
const embeddings_model = new ZhipuAIEmbeddings({});

// // texts是字符串列表
// const texts = docs.map(doc => doc.pageContent);
// // 使用embedding模型对 给定文档 进行embedding形成向量
// const embeddings = await embeddings_model.embedDocuments(texts);
// console.log(embeddings.length, "embedding后的文档数量：");
// console.log("embedding后的文档内容0：", embeddings[0]);

// 对给定字符串进行embedding形成向量
const embedded_query = await embeddings_model.embedQuery("比特币的价格是什么");
console.log("embedding后的查询内容：", embedded_query);


/*
    RAG
    1. 有了llm
    2. 读取了文件 embedding -> 存储到向量数据库  
    3. 然后以后每次我只需要 对我的输入（query）进行embedding -> 查询向量数据库 -> 得到最相关（相似度高的）的文档 -> 生成答案
*/
