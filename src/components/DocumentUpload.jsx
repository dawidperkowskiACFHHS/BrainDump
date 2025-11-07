import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { extractText } from '../lib/parser';
import { Button } from './ui/Button';
import { Upload, Trash2, Loader2, FileText, Eye, Download, X } from 'lucide-react';

export function DocumentUpload({ user }) {
  const { addDocument, deleteDocument, showToast } = useStore();
  const [uploading, setUploading] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    for (const file of files) {
      try {
        const content = await extractText(file);
        await addDocument(user.id, file, content);
      } catch (error) {
        showToast(`Failed to upload ${file.name}: ${error.message}`, 'error');
      }
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleView = (doc) => {
    if (doc.originalFile) {
      const blob = doc.originalFile instanceof Blob ? doc.originalFile : new Blob([doc.originalFile], { type: doc.fileType });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else {
      setViewingDoc(doc);
    }
  };

  const handleDownload = (doc) => {
    if (doc.originalFile) {
      const blob = doc.originalFile instanceof Blob ? doc.originalFile : new Blob([doc.originalFile], { type: doc.fileType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.filename;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([doc.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.filename.replace(/\.[^.]+$/, '.txt');
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="gradient-border rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-500" />
          Documents for {user.name}
        </h2>
        
        <input
          type="file"
          id="file-upload"
          accept=".pdf,.txt,.docx"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          className="sr-only"
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center gap-3 px-6 py-12 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}
          <div className="text-center">
            <p className="text-lg font-medium">{uploading ? 'Uploading...' : 'Drop files or click to upload'}</p>
            <p className="text-sm text-gray-500 mt-1">PDF, TXT, DOCX supported</p>
          </div>
        </label>
      </div>

      <div className="space-y-3">
        {user.documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No documents uploaded yet</p>
          </div>
        ) : (
          user.documents.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3 flex-1">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-medium">{doc.filename}</p>
                  <p className="text-sm text-gray-500">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleView(doc)}
                  className="p-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                  aria-label={`View ${doc.filename}`}
                >
                  <Eye className="w-5 h-5 text-blue-400" />
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-2 rounded-lg hover:bg-green-500/20 transition-colors"
                  aria-label={`Download ${doc.filename}`}
                >
                  <Download className="w-5 h-5 text-green-400" />
                </button>
                <button
                  onClick={() => deleteDocument(user.id, doc.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                  aria-label={`Delete ${doc.filename}`}
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {viewingDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setViewingDoc(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{viewingDoc.filename}</h3>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-black/50 rounded-xl p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">{viewingDoc.content}</pre>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
