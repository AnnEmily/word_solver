import { ReactNode, type FC } from "react";
import '../../Solver.css';
import clsx from "clsx";
import { useTheme } from "../hooks/theme-context";

interface PanelProps {
  id?: string;
  title: string;
  children: ReactNode;
}

export const Panel: FC<PanelProps> = ({ id, title, children }) => {
  const { theme } = useTheme();
  const className = clsx('panel', theme)

  return (
    <div id={id} className={className}>
      <div className={'panel-title'}>{title}</div>
      {children}
    </div>
  );
};

export default Panel;