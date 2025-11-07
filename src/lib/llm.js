const CREDAL_API_KEY = import.meta.env.VITE_CREDAL_API_KEY;
const CREDAL_AGENT_ID = import.meta.env.VITE_CREDAL_AGENT_ID;
const USER_EMAIL = import.meta.env.VITE_USER_EMAIL;
const CREDAL_ENDPOINT = 'https://app.credal.acf.gov/api/v0/copilots/sendMessage';

export async function* streamChat(messages, userDocs) {
  let response;
  try {
    const userMessage = messages[messages.length - 1].content;
    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    
    // Build context from user's documents
    const context = userDocs.map(d => `[${d.filename}]\n${d.content}`).join('\n\n---\n\n');
    const fullMessage = `${systemPrompt}\n\nContext from documents:\n${context}\n\nUser question: ${userMessage}`;
    
    console.log('RAG Context being sent:', { docCount: userDocs.length, messageLength: fullMessage.length });
    
    response = await fetch(CREDAL_ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CREDAL_API_KEY}`
      },
      body: JSON.stringify({
        agentId: CREDAL_AGENT_ID,
        message: fullMessage,
        userEmail: USER_EMAIL
      })
    });
  } catch (error) {
    const corsHint = error.message.includes('Failed to fetch') 
      ? ' This is likely a CORS issue. The app needs to be deployed to the same domain as the Credal API (app.credal.acf.gov) or the API needs to allow CORS from localhost for development.'
      : '';
    throw new Error(`Network Error: ${error.message}.${corsHint}`);
  }

  if (!response.ok) {
    let errorBody = '';
    try {
      errorBody = await response.text();
    } catch (e) {
      // ignore
    }
    throw new Error(`API Error ${response.status}: ${response.statusText}${errorBody ? `\n\nResponse: ${errorBody}` : ''}`);
  }

  const data = await response.json();
  const message = data.sendChatResult?.response?.message;
  
  if (message) {
    yield message;
  } else {
    throw new Error('No response message from Credal API');
  }
}
