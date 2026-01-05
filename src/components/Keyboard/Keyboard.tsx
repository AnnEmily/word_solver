import { ReactNode, type FC } from "react";
import clsx from "clsx";

import { useTheme } from "../../shared/theme/useTheme";
import '../../Solver.css';
import KeyRow from "./KeyRow";

const rowOne = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const rowTwo = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const rowThree = ['⏎', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'];

// interface KeyboardProps {
//   children: ReactNode;
// }#343434

export const Keyboard: FC = () => {
  const { theme } = useTheme();
  const className = clsx('keyboard', theme)

  return (
    <div id="keyboard" className={className}>
      <KeyRow id="rowOne" keys={rowOne} />
      <KeyRow id="rowTwo" keys={rowTwo} />
      <KeyRow id="rowThree" keys={rowThree} />
    </div>
  );
};

export default Keyboard;