import '@testing-library/jest-dom';

jest.mock('next/image', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
    return React.forwardRef(function Image(props: any, ref: any) {
      const {src, alt, ...rest} = props;
      return React.createElement('img', {src, alt, ref, ...rest});
  });
});

jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');

  const AnimatePresence = ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children);

  const motion = new Proxy({}, {
    get: () => (props: any) => React.createElement(props?.as || 'div', props, props?.children),
  });

  return { AnimatePresence, motion };
});

Object.defineProperty(global.HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: jest.fn(),
});

Object.defineProperty(global.HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: jest.fn(),
});
