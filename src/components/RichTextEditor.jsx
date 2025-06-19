// src/components/RichTextEditor.jsx
import React, { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

const initialConfig = {
  namespace: 'DevJournalEditor',
  onError(error) {
    console.error('Lexical error:', error);
  },
};

export default function RichTextEditor({ onChange, initialHtml = '' }) {
  const [editorStateInitialized, setEditorStateInitialized] = useState(false);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border p-4 rounded-lg">
        <RichTextPlugin
          contentEditable={<ContentEditable className="min-h-[200px] outline-none" />}
          placeholder={<div className="absolute top-4 left-4 text-gray-400">Start writing your content...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin
          onChange={editorState => {
            const html = editorState.read(() => {
              const selection = editorState._nodeMap.get('root');
              return selection.getTextContent(); // simple text fallback
            });
            onChange(html);
          }}
        />
      </div>
    </LexicalComposer>
  );
}
