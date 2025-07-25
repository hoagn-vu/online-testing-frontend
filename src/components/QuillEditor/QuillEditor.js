// QuillEditor.jsx
import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import PropTypes from 'prop-types';

const QuillEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Nhập câu hỏi tại đây...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            ['image']
          ]
        }
      });

      // Set initial content if any
      if (value) {
        quillInstance.current.clipboard.dangerouslyPasteHTML(value);
      }

      // Handle text change
      quillInstance.current.on('text-change', () => {
        const html = editorRef.current.querySelector('.ql-editor').innerHTML;
        onChange?.(html);
      });
    }

    return () => {
      // Cleanup
      if (quillInstance.current) {
        quillInstance.current.off('text-change');
        quillInstance.current = null;
      }
    };
  }, []);

  return (
    <div>
      <div
        ref={editorRef}
        style={{
          minHeight: '80px',
          maxHeight: '200px',
          overflowY: 'auto',
          fontSize: "16px"
        }}
      />
    </div>
  );
};

QuillEditor.propTypes = {
  value: PropTypes.string.isRequired,    
  onChange: PropTypes.func.isRequired,

};
export default QuillEditor;
