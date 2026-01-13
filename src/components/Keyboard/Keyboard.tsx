import { type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";

import { useTheme } from "../../shared/theme/useTheme";
import { useSolverStore } from "../../shared/store";
import { qwertyKeyboard } from "../../shared/constants";
import '../../Solver.css';

import KeyRow from "./KeyRow";

export const Keyboard: FC = () => {
  const { colorSet, wordConfirmed, wordFound, wordLength } = useSolverStore(useShallow(state => ({
    colorSet: state.colorSet,
    wordConfirmed: state.wordConfirmed,
    wordFound: state.wordFound,
    wordLength: state.wordLength,
  })));

  const className = clsx('keyboard', useTheme().theme)
  
  return (
    <div id="keyboard" className={className}>
      {!wordFound && !wordConfirmed && wordLength !== 0 && (
        <div className="panel">
          {qwertyKeyboard.map((row, index) => (
            <KeyRow key={index} id={`kb-row${index + 1}`} keys={row} />
          ))}
        </div>
      )}

      {!wordFound && wordConfirmed && !colorSet && (
        <div className="msg warning">{"You need to select a color set"}</div>
      )}

      {wordFound && (
        <div className="msg info">{"Congrats !"}</div>
      )}
    </div>
  );
};

export default Keyboard;