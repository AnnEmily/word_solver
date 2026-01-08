import { type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";

import { useTheme } from "../../shared/theme/useTheme";
import { BACKSPACE, ENTER } from "../../shared/constants";
import { useSolverStore } from "../../shared/solverStore";
import '../../Solver.css';

interface KeyRowProps {
  id: string;
  keys: string[];
}

export const KeyRow: FC<KeyRowProps> = ({ id, keys }) => {
  const setLetter = useSolverStore(state => state.setLetter);
  const allLettersEntered = useSolverStore(useShallow(state => state.allLettersEntered));

  const { theme } = useTheme();
  const className = clsx('keyrow', theme)

  return (
    <div id={id} className={className}>
      {keys.map((key) => {
        const isActionKey = key === ENTER || key === BACKSPACE;
        const isDisabled = !allLettersEntered && key === ENTER;
        const keyClass = clsx('key', isActionKey && 'action-key', isDisabled && 'disabled');

        return (
          <div
            key={key}
            className={keyClass}
            onClick={() => isDisabled ? null : setLetter(key)}
            aria-disabled={isDisabled}
          >
            {key}
          </div>
        );
      })}
    </div>
  );
};

export default KeyRow;