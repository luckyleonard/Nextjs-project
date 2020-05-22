import { cloneElement } from 'react';

const style = {
  width: '100%',
  maxWidth: 1200,
  marginLeft: 'auto',
  marginRight: 'auto',
};

export default ({ children, renderer = <div /> }) => {
  return cloneElement(renderer, {
    style: Object.assign({}, renderer.props.style, style),
    children,
  });
};
