import { useMemo } from "react";
import { createPortal } from "react-dom";

interface IProps {
  elementId: string;
  children: React.ReactNode;
}

const Portal = ({ children, elementId }: IProps) => {
  const rootElement = useMemo(() => document.getElementById(elementId) as HTMLElement, [elementId]);

  return createPortal(children, rootElement);
};

export default Portal;
