import { ReactNode } from 'react';
import { AutoSizer as AutoSizerBase, AutoSizerChildProps } from 'react-virtualized-auto-sizer';

interface IProps {
  children: (size: AutoSizerChildProps) => ReactNode;
}

// react-virtualized-auto-sizer v2 dropped the children render-function API in
// favor of a `renderProp`, and switched to a named export. This thin wrapper
// restores the default-import + children API so existing call sites keep working.
const AutoSizer = ({ children }: IProps) => <AutoSizerBase renderProp={children} />;

export default AutoSizer;
