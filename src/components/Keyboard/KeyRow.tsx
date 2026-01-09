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
  const { activeCellIndex, allLettersEntered } = useSolverStore(useShallow(state => ({
    activeCellIndex: state.activeCellIndex,
    allLettersEntered: state.allLettersEntered,
  })));

  const { theme } = useTheme();
  const className = clsx('keyrow', theme)

  return (
    <div id={id} className={className}>
      {keys.map((key) => {
        const isActionKey = key === ENTER || key === BACKSPACE;
        const isDisabledKey = (key === ENTER && !allLettersEntered) || (key === BACKSPACE && activeCellIndex === 0);
        const keyClass = clsx('key', isActionKey && 'action-key', isDisabledKey && 'disabled');

        return (
          <div
            key={key}
            className={keyClass}
            onClick={() => isDisabledKey ? null : setLetter(key)}
            aria-disabled={isDisabledKey}
          >
            {key}
          </div>
        );
      })}
    </div>
  );
};

export default KeyRow;