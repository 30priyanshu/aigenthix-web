import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

const RichTextEditor = ({ value, onChange }) => {
  const editor = useRef(null);

  // Configuration for Jodit Editor
  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Start writing your blog here...',
    height: 600,
    style: {
      background: '#fff',
      color: '#333'
    },
    // We enable a massive set of features typical of MS Word
    buttons: [
      'source', '|',
      'bold', 'strikethrough', 'underline', 'italic', '|',
      'superscript', 'subscript', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'brush', 'paragraph', '|',
      'image', 'video', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'symbol', 'fullsize', 'preview', 'print'
    ],
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
    // Jodit automatically converts styling to inline-style CSS
    useSplitMode: false,
    enter: "P",
    defaultMode: "1",
    toolbarAdaptive: false,
    // Enable Full screen mode out of the box
    fullsize: false 
  }), []);

  return (
    <div style={{ marginBottom: '50px' }}>
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        tabIndex={1}
        onBlur={newContent => onChange(newContent)}
      />
    </div>
  );
};

export default RichTextEditor;
