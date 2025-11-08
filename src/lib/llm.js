// Local RAG system - documents stay in browser, AI-like responses from local search
export async function* streamChat(messages, userDocs) {
  const userName = messages.find(m => m.role === 'system')?.content?.match(/You are (.+?)\./)?.[1] || 'this person';
  const userMessage = messages[messages.length - 1].content;
  const query = userMessage.toLowerCase();
  
  // Search local documents for relevant content
  const searchResults = searchLocalDocs(query, userDocs);
  
  if (searchResults.length === 0) {
    yield `I don't have any information about "${userMessage}" in ${userName}'s documents. Try asking about specific topics, projects, or document names.`;
    return;
  }
  
  // Build context-aware response
  const response = buildResponse(userMessage, searchResults, userName);
  yield response;
}

function searchLocalDocs(query, docs) {
  const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
  
  return docs.map(doc => {
    const content = doc.content.toLowerCase();
    const filename = doc.filename.toLowerCase();
    
    // Calculate relevance score
    let score = 0;
    const matches = [];
    
    keywords.forEach(keyword => {
      if (filename.includes(keyword)) score += 10;
      
      let pos = content.indexOf(keyword);
      while (pos !== -1) {
        score += 1;
        // Extract snippet around match
        const start = Math.max(0, pos - 150);
        const end = Math.min(doc.content.length, pos + 150);
        matches.push({
          snippet: doc.content.slice(start, end).trim(),
          position: pos
        });
        pos = content.indexOf(keyword, pos + 1);
      }
    });
    
    return { doc, score, matches: matches.slice(0, 3) };
  })
  .filter(r => r.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);
}

function buildResponse(question, results, userName) {
  const isListQuestion = question.match(/what|list|show|tell me about|files|documents/i);
  
  if (isListQuestion && question.match(/files|documents/i)) {
    const fileList = results.map(r => `• **${r.doc.filename}**`).join('\n');
    return `${userName} has these relevant documents:\n\n${fileList}\n\nAsk me about any specific topic or document for more details.`;
  }
  
  // Build contextual response
  let response = `Based on ${userName}'s documents, here's what I found:\n\n`;
  
  results.forEach((result, i) => {
    response += `**From ${result.doc.filename}:**\n`;
    
    if (result.matches.length > 0) {
      result.matches.forEach(match => {
        response += `\n...${match.snippet}...\n`;
      });
    } else {
      // Show beginning of document if no specific matches
      response += `\n${result.doc.content.slice(0, 300)}...\n`;
    }
    
    response += '\n';
  });
  
  response += `\n*Found in ${results.length} document${results.length > 1 ? 's' : ''}*`;
  
  return response;
}
