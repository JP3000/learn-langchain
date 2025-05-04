import { ChatZhipuAI } from "@langchain/community/chat_models/zhipuai";
import { ZhipuAIEmbeddings } from "@langchain/community/embeddings/zhipuai";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";


// 环境变量配置
import * as dotenv from "dotenv";
dotenv.config();

// 大模型配置
const model = new ChatZhipuAI({
    model: "glm-4-plus",
    temperature: 0.7,
    zhipuAIApiKey: process.env.ZHIPUAI_API_KEY
});

// 提示词模版
const prompt = ChatPromptTemplate.fromTemplate(
    `Answer the user's question from the following context: 
  {context}
  Question: {input}`
);

// 创建链 prompts -> llm -> output
const chain = await createStuffDocumentsChain({
    llm: model,
    prompt,
});

// Use Cheerio to scrape content from webpage and create documents
const loader = new CheerioWebBaseLoader(
    "https://js.langchain.com/v0.2/docs/concepts/#langchain-expression-language"
);
const docs = await loader.load();

// Text Splitter
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
});
const splitDocs = await splitter.splitDocuments(docs);
// console.log(splitDocs);

// Instantiate Embeddings function
const embeddings = new ZhipuAIEmbeddings({});

// Create Vector Store
const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
);

// Create a retriever from vector store
const retriever = vectorstore.asRetriever({ k: 2 });

// Create a retrieval chain
const retrievalChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever,
});


const response = await retrievalChain.invoke({
    input: "What is LCEL?",
});

console.log(response);