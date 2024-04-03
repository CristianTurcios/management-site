import React, { FC } from 'react';

type ButtonProps = {
    text: string
}

const Button: FC<ButtonProps> = (props) => {
  const { text } = props;

  return (
    <button type="submit" className="button--normal">{text}</button>
  );
};

export default Button;
