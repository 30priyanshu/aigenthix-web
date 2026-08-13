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
    buttons: [
      'source', '|',
      'bold', 'strikethrough', 'underline', 'italic', '|',
      'superscript', 'subscript', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'brush', 'paragraph', '|',
      'quote', 'alertBox', '|',
      'image', 'video', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'symbol', 'fullsize', 'preview', 'print'
    ],
    controls: {
      paragraph: {
        list: {
          p: 'Normal',
          h1: 'Heading 1',
          h2: 'Heading 2',
          h3: 'Heading 3',
          h4: 'Heading 4',
          h5: 'Heading 5',
          h6: 'Heading 6'
        }
      },
      alertBox: {
        icon: 'info',
        tooltip: 'Insert Alert Box',
        exec: (editor) => {
          editor.s.insertHTML(
            '<div class="custom-alert-box" style="padding: 15px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 4px; margin: 10px 0;"><strong>Alert:</strong> Replace this text with your alert message.</div><p><br></p>'
          );
        }
      },
      rotateImage: {
        icon: 'update',
        tooltip: 'Rotate Image 90°',
        exec: (editor, current) => {
          if (current && current.tagName === 'IMG') {
            const currentRotation = parseInt(current.getAttribute('data-rotation') || '0', 10);
            const newRotation = (currentRotation + 90) % 360;
            current.setAttribute('data-rotation', newRotation);
            current.style.transform = `rotate(${newRotation}deg)`;
            // Also adjust margins if rotated 90 or 270 so it doesn't overlap text
            if (newRotation === 90 || newRotation === 270) {
               current.style.margin = '20px';
            } else {
               current.style.margin = '0';
            }
            editor.e.fire('change');
          }
        }
      }
    },
    popup: {
      a: ['link', 'unlink'],
      img: [
        'outdent', 'indent', 'left', 'center', 'right', 'full', 'margin', '|',
        'rotateImage', '|',
        'delete'
      ]
    },
    link: {
      noFollowCheckbox: true,
      openInNewTabCheckbox: true,
    },
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
    useSplitMode: false,
    enter: "P",
    defaultMode: "1",
    toolbarAdaptive: false,
    fullsize: false,
    uploader: {
      url: `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/admin/upload/image`,
      format: 'json',
      filesVariableName: () => 'file',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('cms_auth_token')}`
      },
      isSuccess: function(resp) {
        return resp && resp.success;
      },
      process: function (resp) {
        return {
          files: [resp.data.url],
          path: resp.data.url,
          baseurl: '',
          error: 0,
          message: resp.message
        };
      },
      defaultHandlerSuccess: function(data, resp) {
        if (data.files && data.files.length) {
          for (let i = 0; i < data.files.length; i++) {
            this.s.insertImage(data.baseurl + data.files[i]);
          }
        }
      }
    }
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
