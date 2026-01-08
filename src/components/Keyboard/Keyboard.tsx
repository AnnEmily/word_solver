import { type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";

import { useTheme } from "../../shared/theme/useTheme";
import { useSolverStore } from "../../shared/solverStore";
import { qwertyKeyboard } from "../../shared/constants";
import '../../Solver.css';

import KeyRow from "./KeyRow";
import { Button } from "@mui/material";

export const Keyboard: FC = () => {
  const { colorSet, statusesConfirmed, setStatusesConfirmed, wordConfirmed, wordLength } = useSolverStore(useShallow(state => ({
    colorSet: state.colorSet,
    statusesConfirmed: state.statusesConfirmed,
    setStatusesConfirmed: state.setStatusesConfirmed,
    wordConfirmed: state.wordConfirmed,
    wordLength: state.wordLength,
  })));

  const className = clsx('keyboard', useTheme().theme)
  
  return (
    <div id="keyboard" className={className}>
      {!wordConfirmed && wordLength !== 0 && (
        <div className="panel">
          {qwertyKeyboard.map((row, index) => (
          <KeyRow key={index} id={`row${index + 1}`} keys={row} />
          ))}
        </div>
      )}

      {wordConfirmed && !colorSet && (
        <div className="msg warning">{"You need to select a Color Set"}</div>
      )}

      {wordConfirmed && colorSet && !statusesConfirmed && (
          <div className="msg">
            <div className="warning">{"Click on each letter to set its status"}</div>
            <Button
              variant="contained"
              className="button"
              sx={{ width: 'auto', marginTop: '10px' }}
              onClick={() => setStatusesConfirmed(true)}
            >
              {"Done"}
            </Button>
          </div>
      )}
    </div>
  );
};

export default Keyboard;