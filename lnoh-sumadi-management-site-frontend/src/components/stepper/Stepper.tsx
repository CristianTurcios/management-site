import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export type Step = {
    text: string,
    step: number,
    active: boolean,
    completed: boolean,
    showNumbers: boolean,
}

interface StepperProps {
  steps: Step[],
  onClickStep(step: number): void
}

const Stepper: FC<StepperProps> = (props) => {
  const { steps, onClickStep } = props;

  const getLabel = (element: Step) => {
    if (element.active) {
      return (<span>{element.step}</span>);
    } if (!element.active && element.completed) {
      return (<span><i><FontAwesomeIcon icon={faCheck} /></i></span>);
    }
    return (<span>{element.step}</span>);
  };

  return (
    <div className="wizard">
      {
        steps.map((element: Step) => (
          <div
            className={!element.active ? 'step step--visited' : 'step step--active'}
            key={element.step}
            onClick={() => onClickStep(element.step)}
            onKeyPress={() => onClickStep(element.step)}
            role="button"
            tabIndex={0}
          >
            {
              element.showNumbers && (<div className="step__number">{getLabel(element) }</div>)
            }
            <div className="step__text">
              <span>{element.text}</span>
            </div>
          </div>
        ))
        }
    </div>
  );
};

export default Stepper;
