import { ReactNode, type FC } from "react";
import clsx from "clsx";

import { useTheme } from "../../shared/theme/useTheme";
import '../../Solver.css';

interface KeyRowProps {
  id: string;
  keys: string[];
}

export const KeyRow: FC<KeyRowProps> = ({ id, keys }) => {
  const { theme } = useTheme();
  const className = clsx('keyrow', theme)

  return (
    <div id={id} className={className}>
      {keys.map((key) => (
        <div key={key} className="key">
          {key}
        </div>
      ))}
    </div>
  );
};

export default KeyRow;