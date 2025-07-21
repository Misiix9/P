import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Save, 
  FolderOpen, 
  Plus, 
  X, 
  Download,
  Upload,
  Search,
  RotateCcw,
  RotateCw,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Palette,
  ZoomIn,
  ZoomOut,
  Settings
} from 'lucide-react';
import { playClick, playSuccess, playTyping } from '../../../utils/soundManager';
import { useNotificationStore } from '../../../stores/useStore';

const Notepad = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: 'Welcome.txt',
      content: `Welcome to Portfolio Notepad!

This is a feature-rich text editor built with React and modern web technologies.

Features:
- Multiple document tabs
- Auto-save functionality
- Rich text formatting
- Search and replace
- Word count and statistics
- Customizable themes
- Export options

Try creating a new document or editing this one!

Happy writing! 📝`,
      isModified: false,
      wordCount: 0,
      characterCount: 0,
      fontSize: 14,
      fontFamily: 'monospace'
    }
  ]);

  const [activeDocumentId, setActiveDocumentId] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [isFormatting, setIsFormatting] = useState(false);
  const [documentSettings, setDocumentSettings] = useState({
    fontSize: 14,
    fontFamily: 'monospace',
    theme: 'dark',
    wordWrap: true,
    showLineNumbers: false
  });

  const textAreaRef = useRef(null);
  const addNotification = useNotificationStore((state) => state.addNotification);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      documents.forEach(doc => {
        if (doc.isModified) {
          saveDocument(doc.id);
        }
      });
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSave);
  }, [documents]);

  // Update word and character count
  useEffect(() => {
    const activeDoc = documents.find(doc => doc.id === activeDocumentId);
    if (activeDoc) {
      const words = activeDoc.content.trim() ? activeDoc.content.trim().split(/\s+/).length : 0;
      const characters = activeDoc.content.length;
      
      setDocuments(docs => docs.map(doc => 
        doc.id === activeDocumentId 
          ? { ...doc, wordCount: words, characterCount: characters }
          : doc
      ));
    }
  }, [documents, activeDocumentId]);

  const createNewDocument = () => {
    playClick();
    const newId = Math.max(...documents.map(d => d.id)) + 1;
    const newDoc = {
      id: newId,
      title: `Untitled-${newId}.txt`,
      content: '',
      isModified: false,
      wordCount: 0,
      characterCount: 0,
      fontSize: documentSettings.fontSize,
      fontFamily: documentSettings.fontFamily
    };

    setDocuments([...documents, newDoc]);
    setActiveDocumentId(newId);
    
    addNotification({
      message: 'New document created',
      type: 'success'
    });
  };

  const closeDocument = (docId) => {
    playClick();
    const doc = documents.find(d => d.id === docId);
    
    if (doc?.isModified) {
      if (!window.confirm('You have unsaved changes. Close anyway?')) {
        return;
      }
    }

    if (documents.length === 1) {
      // Don't close the last document, just reset it
      setDocuments([{
        id: 1,
        title: 'Untitled.txt',
        content: '',
        isModified: false,
        wordCount: 0,
        characterCount: 0,
        fontSize: documentSettings.fontSize,
        fontFamily: documentSettings.fontFamily
      }]);
      setActiveDocumentId(1);
    } else {
      const newDocs = documents.filter(d => d.id !== docId);
      setDocuments(newDocs);
      
      if (activeDocumentId === docId) {
        setActiveDocumentId(newDocs[newDocs.length - 1].id);
      }
    }
  };

  const updateDocumentContent = (docId, content) => {
    playTyping();
    setDocuments(docs => docs.map(doc => 
      doc.id === docId 
        ? { ...doc, content, isModified: true }
        : doc
    ));
  };

  const saveDocument = (docId) => {
    playSuccess();
    setDocuments(docs => docs.map(doc => 
      doc.id === docId 
        ? { ...doc, isModified: false }
        : doc
    ));
    
    addNotification({
      message: 'Document saved',
      type: 'success'
    });
  };

  const exportDocument = (docId, format = 'txt') => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    const blob = new Blob([doc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.title;
    a.click();
    URL.revokeObjectURL(url);

    playSuccess();
    addNotification({
      message: `Document exported as ${format.toUpperCase()}`,
      type: 'success'
    });
  };

  const searchAndReplace = () => {
    const activeDoc = documents.find(doc => doc.id === activeDocumentId);
    if (!activeDoc || !searchTerm) return;

    const newContent = activeDoc.content.replaceAll(searchTerm, replaceTerm);
    updateDocumentContent(activeDocumentId, newContent);
    
    addNotification({
      message: `Replaced "${searchTerm}" with "${replaceTerm}"`,
      type: 'success'
    });
  };

  const insertTimestamp = () => {
    const activeDoc = documents.find(doc => doc.id === activeDocumentId);
    if (!activeDoc) return;

    const timestamp = new Date().toLocaleString();
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newContent = 
      activeDoc.content.substring(0, start) + 
      timestamp + 
      activeDoc.content.substring(end);
    
    updateDocumentContent(activeDocumentId, newContent);
    
    // Move cursor after timestamp
    setTimeout(() => {
      textarea.setSelectionRange(start + timestamp.length, start + timestamp.length);
    }, 0);
  };

  const changeFontSize = (delta) => {
    const newSize = Math.max(8, Math.min(32, documentSettings.fontSize + delta));
    setDocumentSettings({ ...documentSettings, fontSize: newSize });
  };

  const activeDocument = documents.find(doc => doc.id === activeDocumentId);

  return (
    <div className="h-full flex flex-col bg-black/5">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-black/10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-white">Notepad</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded hover:bg-white/10 text-white/70 transition"
            title="Search & Replace"
          >
            <Search className="w-4 h-4" />
          </button>
          
          <button
            onClick={insertTimestamp}
            className="p-2 rounded hover:bg-white/10 text-white/70 transition"
            title="Insert Timestamp"
          >
            <Type className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => changeFontSize(-1)}
            className="p-2 rounded hover:bg-white/10 text-white/70 transition"
            title="Decrease Font Size"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => changeFontSize(1)}
            className="p-2 rounded hover:bg-white/10 text-white/70 transition"
            title="Increase Font Size"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => exportDocument(activeDocumentId)}
            className="p-2 rounded hover:bg-white/10 text-white/70 transition"
            title="Export Document"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center bg-black/5 border-b border-white/10 overflow-x-auto">
        {documents.map((doc) => (
          <motion.div
            key={doc.id}
            className={`flex items-center gap-2 px-4 py-2 border-r border-white/10 cursor-pointer min-w-0 max-w-48 ${
              doc.id === activeDocumentId ? 'bg-black/20' : 'hover:bg-white/5'
            }`}
            onClick={() => setActiveDocumentId(doc.id)}
            layout
          >
            <FileText className="w-4 h-4 text-white/60 flex-shrink-0" />
            <span className="text-white/80 text-sm truncate flex-1">
              {doc.title} {doc.isModified && '*'}
            </span>
            {documents.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeDocument(doc.id);
                }}
                className="w-4 h-4 flex items-center justify-center hover:bg-white/20 rounded"
              >
                <X className="w-3 h-3 text-white/60" />
              </button>
            )}
          </motion.div>
        ))}
        
        <button
          onClick={createNewDocument}
          className="p-2 hover:bg-white/10 text-white/60 hover:text-white transition flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black/10 border-b border-white/10 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-1 rounded bg-black/20 border border-white/10 text-white text-sm focus:border-accent focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Replace with..."
                  value={replaceTerm}
                  onChange={(e) => setReplaceTerm(e.target.value)}
                  className="flex-1 px-3 py-1 rounded bg-black/20 border border-white/10 text-white text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <button
                onClick={searchAndReplace}
                className="px-4 py-1 bg-accent text-black rounded text-sm font-medium hover:bg-accent/80 transition"
              >
                Replace All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Editor */}
      <div className="flex-1 flex">
        {/* Text Area */}
        <div className="flex-1 relative">
          <textarea
            ref={textAreaRef}
            value={activeDocument?.content || ''}
            onChange={(e) => updateDocumentContent(activeDocumentId, e.target.value)}
            className="w-full h-full p-4 bg-transparent text-white resize-none outline-none scrollbar-glass"
            style={{
              fontSize: `${documentSettings.fontSize}px`,
              fontFamily: documentSettings.fontFamily,
              lineHeight: 1.5
            }}
            placeholder="Start writing..."
            spellCheck="true"
          />
        </div>

        {/* Line Numbers (if enabled) */}
        {documentSettings.showLineNumbers && (
          <div className="w-12 bg-black/20 border-r border-white/10 p-2 text-xs text-white/50 font-mono">
            {activeDocument?.content.split('\n').map((_, index) => (
              <div key={index} className="text-right">
                {index + 1}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-black/10 border-t border-white/10 px-4 py-2 text-xs text-white/60 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>
            Line: {activeDocument?.content.substring(0, textAreaRef.current?.selectionStart || 0).split('\n').length || 1}
          </span>
          <span>
            Words: {activeDocument?.wordCount || 0}
          </span>
          <span>
            Characters: {activeDocument?.characterCount || 0}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span>{documentSettings.fontFamily}</span>
          <span>{documentSettings.fontSize}px</span>
          <span>{activeDocument?.isModified ? 'Modified' : 'Saved'}</span>
          <button
            onClick={() => saveDocument(activeDocumentId)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition"
          >
            <Save className="w-3 h-3" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notepad;