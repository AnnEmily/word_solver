import { type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";

import { useTheme } from "../../shared/theme/useTheme";
import { useSolverStore } from "../../shared/store";
import { qwertyKeyboard } from "../../shared/constants";
import '../../Solver.css';

import KeyRow from "./KeyRow";

export const Keyboard: FC = () => {
  const { wordFound, wordLength } = useSolverStore(useShallow(state => ({
    wordFound: state.wordFound,
    wordLength: state.wordLength,
  })));

  const className = clsx('keyboard', useTheme().theme);
  
  return (
    <div id="keyboard" className={className}>
      {!wordFound && wordLength !== 0 && (
        <div className="panel">
          {qwertyKeyboard.map((row, index) => (
            <KeyRow key={index} id={`kb-row${index + 1}`} keys={row} />
          ))}
        </div>
      )}

      {wordFound && (
        <div className="msg info">{"Congrats !"}</div>
      )}
    </div>
  );
};

export default Keyboard;
