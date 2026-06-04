import { ReactNode } from 'react';
import { AutoSizer as AutoSizerBase, AutoSizerChildProps } from 'react-virtualized-auto-sizer';

interface IProps {
  children: (size: AutoSizerChildProps) => ReactNode;
}

// react-virtualized-auto-sizer v2 dropped the children render-function API in
// favor of a `renderProp`, and switched to a named export. This thin wrapper
// restores the default-import + children API so existing call sites keep working.
// v2 also reports width/height as `undefined` until the first measurement (v1
// gave numbers), which produced NaN in size calculations — so defer rendering
// the children until both dimensions are known.
const AutoSizer = ({ children }: IProps) => (
  <AutoSizerBase
    renderProp={({ width, height }) =>
      width === undefined || height === undefined ? null : children({ width, height })
    }
  />
);

export default AutoSizer;
