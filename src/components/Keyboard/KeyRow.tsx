import { type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";

import { useTheme } from "../../shared/theme/useTheme";
import { BACKSPACE, ENTER } from "../../shared/constants";
import { useSolverStore } from "../../shared/store";
import '../../Solver.css';

interface KeyRowProps {
  id: string;
  keys: string[];
}

export const KeyRow: FC<KeyRowProps> = ({ id, keys }) => {
  const setLetter = useSolverStore(state => state.setLetter);
  const { activeCellIndex, allLettersEntered, wordConfirmed } = useSolverStore(useShallow(state => ({
    activeCellIndex: state.activeCellIndex,
    allLettersEntered: state.allLettersEntered,
    wordConfirmed: state.wordConfirmed,
  })));

  const { theme } = useTheme();
  const className = clsx('keyrow', theme)

  return (
    <div id={id} className={className}>
      {keys.map((key) => {
        const isKeyEnter = key === ENTER;
        const isKeyBackSpace = key === BACKSPACE;
        const isActionKey = isKeyEnter || isKeyBackSpace ;
        const isDisabledKey = wordConfirmed || (isKeyEnter && !allLettersEntered) || (isKeyBackSpace && activeCellIndex === 0);
        const keyClass = clsx('key', isActionKey && 'action-key', isKeyEnter && !isDisabledKey && 'button', isDisabledKey && 'disabled');

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