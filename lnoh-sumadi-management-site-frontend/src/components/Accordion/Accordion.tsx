import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

type AccordionProps = {
    children: any;
    title: string;
    isOpen: boolean;
    collapse(): void
}

const Accordion: FC<AccordionProps> = (props) => {
  const {
    children, title, isOpen, collapse,
  } = props;

  return (
    <div className={`collapse ${isOpen ? 'collapse--open' : ''}`}>
      <a className="collapse-toggle" onClick={collapse} href={undefined}>
        <div className="collapse-toggle__text">{title}</div>
        <div className="collapse-toggle__icon">
          <i>
            {
            isOpen
              ? <FontAwesomeIcon icon={faChevronUp} />
              : <FontAwesomeIcon icon={faChevronDown} />
            }
          </i>
        </div>
      </a>
      <div className="collapse-content">
        <div className="row">
          { children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
