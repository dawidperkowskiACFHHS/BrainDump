import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function extractText(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  
  switch (ext) {
    case 'txt':
      return await extractTextFromTxt(file);
    case 'pdf':
      return await extractTextFromPdf(file);
    case 'docx':
      return await extractTextFromDocx(file);
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

async function extractTextFromTxt(file) {
  return await file.text();
}

async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  
  return text;
}

async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
