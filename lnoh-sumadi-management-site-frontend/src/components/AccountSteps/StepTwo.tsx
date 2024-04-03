import React, { FC, useContext } from 'react';
import { AccountInterface } from 'interfaces/Account';
import RichEditor from 'components/RichEditor/RichEditor';
import { SessionContext } from 'context/SessionContext';
import { hasAccess } from 'services/AuthenticationService';

type StepProps = {
  data: AccountInterface;
  onSetRules(data: any, language: string): void,
  onChangeStep(currentStep: number, step: number): void
}

const StepTwo: FC<StepProps> = (props) => {
  const { data, onSetRules, onChangeStep } = props;

  const { session } = useContext(SessionContext);
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }, { font: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'image',
  ];
  const isReadOnly = !hasAccess(session.user.role as string, ['Admin', 'Editor']);

  /*
  *function to update each Quill editor
  *content, delta and source isn't use in the function,
  *but editor param not work if isn't in these position.
  * I didn't find a way to pass an id to it to distinguish the language of the rules,
  * so I had to do 3 functions :(
  */
  const handleChangeEnglish = (content: string, delta: any, source: string, editor: any) => {
    onSetRules(editor.getContents(), 'en');
  };

  const handleChangeSpanish = (content: string, delta: any, source: string, editor: any) => {
    onSetRules(editor.getContents(), 'es');
  };

  const handleChangePortuguese = (content: string, delta: any, source: string, editor: any) => {
    onSetRules(editor.getContents(), 'pt');
  };

  return (
    <>
      <div className="wizard-content">
        <div className="row">
          <div className="col-12 col-lg-12">
            <label htmlFor="accountRulesEnglish" className="form__label"><strong>English</strong></label>
            <RichEditor
              id="en"
              modules={modules}
              formats={formats}
              value={data?.institutionRules?.en || data?.institution?.institutionRules?.en}
              className="rich-text__editor"
              handleChange={handleChangeEnglish}
              placeholder="Description..."
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-12 col-lg-12">
            <label htmlFor="accountRulesSpanish" className="form__label"><strong>Spanish</strong></label>
            <RichEditor
              id="es"
              modules={modules}
              formats={formats}
              value={data?.institutionRules?.es || data?.institution?.institutionRules?.es}
              className="rich-text__editor"
              handleChange={handleChangeSpanish}
              placeholder="Description..."
              readOnly={isReadOnly}
            />
          </div>
          <div className="col-12 col-lg-12">
            <label htmlFor="accountRulesPortuguese" className="form__label"><strong>Portuguese</strong></label>
            <RichEditor
              id="pt"
              modules={modules}
              formats={formats}
              value={data?.institutionRules?.pt || data?.institution?.institutionRules?.pt}
              className="rich-text__editor"
              handleChange={handleChangePortuguese}
              placeholder="Description..."
              readOnly={isReadOnly}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 wizard-action-container">
          <button type="button" className="button--normal" onClick={() => onChangeStep(2, 1)}>Back</button>
          <button type="button" className="button--normal" onClick={() => onChangeStep(2, 3)}>Next</button>
        </div>
      </div>
    </>
  );
};

export default StepTwo;
