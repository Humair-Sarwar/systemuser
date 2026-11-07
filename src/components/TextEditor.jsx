import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function TextEditor({ value, onChange }) {
  // const [value, setValue] = useState('');

  return <ReactQuill theme="snow" value={value} onChange={onChange} />;
}

export default TextEditor