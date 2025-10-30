// app/lib/vector-store.ts - VERSIÓN CORREGIDA
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document"; // ✅ Importar Document
import fs from "fs";
import path from "path";

// Variable global para almacenar la base de conocimiento
let vectorStore: MemoryVectorStore | null = null;

export async function getVectorStore() {
  if (vectorStore) {
    return vectorStore;
  }
  
  throw new Error("Vector store no inicializado. Ejecuta /api/rag/process-pdfs primero.");
}

export async function initializeVectorStore() {
  const documentsPath = path.join(process.cwd(), "documents");
  
  // Verificar si la carpeta existe
  if (!fs.existsSync(documentsPath)) {
    fs.mkdirSync(documentsPath, { recursive: true });
    console.log("📁 Carpeta 'documents' creada. Agrega tus PDFs allí.");
    return null;
  }

  // Cargar todos los PDFs
  const pdfFiles = fs.readdirSync(documentsPath).filter(file => 
    file.toLowerCase().endsWith(".pdf")
  );

  if (pdfFiles.length === 0) {
    console.log("📭 No hay PDFs en la carpeta 'documents'");
    return null;
  }

  console.log(`📚 Procesando ${pdfFiles.length} PDFs...`);

  // ✅ CORREGIDO: Especificar el tipo Document[] para allDocs
  let allDocs: Document[] = [];

  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(documentsPath, pdfFile);
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();
    
    // Agregar metadata del archivo
    const docsWithMetadata = docs.map(doc => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        source: pdfFile,
        page: doc.metadata.loc?.pageNumber || "Unknown"
      }
    }));
    
    allDocs = allDocs.concat(docsWithMetadata);
  }

  // Dividir en chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(allDocs);

  // Crear embeddings y almacenar en vector store
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

  console.log(`✅ Vector store inicializado con ${splitDocs.length} chunks`);
  return vectorStore;
}

export function isVectorStoreInitialized() {
  return vectorStore !== null;
}
