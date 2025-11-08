export function answerLocalQuestion(question, user) {
  const q = question.toLowerCase().trim();

  // List documents
  if (
    q.match(
      /what (files|documents)|list (files|documents)|show (files|documents)|how many (files|documents)/
    )
  ) {
    if (user.documents.length === 0) {
      return `${user.name} has no documents uploaded yet.`;
    }
    const list = user.documents.map((d) => `• ${d.filename}`).join('\n');
    return `${user.name} has ${user.documents.length} document${user.documents.length !== 1 ? 's' : ''}:\n\n${list}`;
  }

  // Search in content
  const searchMatch = q.match(/search for (.+)|find (.+)|what about (.+)|tell me about (.+)/);
  if (searchMatch) {
    const term = searchMatch[1] || searchMatch[2] || searchMatch[3] || searchMatch[4];
    const results = user.documents.filter(
      (d) => d.content.toLowerCase().includes(term) || d.filename.toLowerCase().includes(term)
    );

    if (results.length === 0) {
      return `I couldn't find "${term}" in ${user.name}'s documents.`;
    }

    const matches = results
      .map((d) => {
        const idx = d.content.toLowerCase().indexOf(term);
        const snippet = idx >= 0 ? d.content.slice(Math.max(0, idx - 50), idx + 150) : '';
        return `• ${d.filename}${snippet ? `\n  ...${snippet}...` : ''}`;
      })
      .join('\n\n');

    return `Found "${term}" in ${results.length} document${results.length !== 1 ? 's' : ''}:\n\n${matches}`;
  }

  return null;
}
