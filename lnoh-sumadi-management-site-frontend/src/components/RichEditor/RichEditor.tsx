import React, { FC } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type RichEditorProps = {
  id: string;
  modules: { toolbar: any[] },
  formats: string[],
  value: string,
  className: string,
  placeholder: string,
  handleChange(content: string, delta: any, source: string, editor: any): void,
  readOnly: boolean
}

const RichEditor: FC<RichEditorProps> = (props) => {
  const {
    id, modules, formats, value, handleChange, className, placeholder, readOnly,
  } = props;
  return (
    <ReactQuill
      readOnly={readOnly}
      id={id}
      modules={modules}
      formats={formats}
      value={value}
      className={className}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

export default RichEditor;
