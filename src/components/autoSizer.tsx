import { ReactNode } from 'react';
import { AutoSizer as AutoSizerBase } from 'react-virtualized-auto-sizer';

interface IProps {
  children: (size: { width: number; height: number }) => ReactNode;
}

// react-virtualized-auto-sizer v2 dropped the children render-function API in
// favor of a `renderProp`, and switched to a named export. This thin wrapper
// restores the default-import + children API so existing call sites keep working.
// v2 also reports width/height as `undefined` until the first measurement (v1
// gave numbers), which produced NaN in size calculations — so defer rendering
// the children until both dimensions are known.
//
// v1 rendered its host element as a zero-size, overflow-visible box so the
// children's layout never fed back into the measured parent; v2 dropped that
// style, letting wide content grow the parent on every measure (runaway width).
// Restore it explicitly.
const AutoSizer = ({ children }: IProps) => {
  return (
    <AutoSizerBase
      style={{ overflow: 'visible', height: 0, width: 0 }}
      renderProp={({ width, height }) =>
        width === undefined || height === undefined ? null : children({ width, height })
      }
    />
  );
};

export default AutoSizer;
