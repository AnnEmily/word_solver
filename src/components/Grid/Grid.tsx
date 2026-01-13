import { Fragment, type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";

import GridRow from "./GridRow";
import { useTheme } from "../../shared/theme/useTheme";
import { useSolverStore } from "../../shared/store";
import '../../Solver.css';


export const Grid: FC = () => {
  const { grid, word, wordFound, wordLength } = useSolverStore(useShallow(state => ({
    grid: state.grid,
    word: state.word,
    wordFound: state.wordFound,
    wordLength: state.wordLength,
  })));
  
  const { theme } = useTheme();
  const className = clsx('grid', theme)

  return (
    <Fragment>
      {wordLength !== 0 && (
        <div id="grid" className={className}>
          {grid.map((row, index) => {
            return <GridRow id={`row-${index}`} key={index} isActiveWord={false} word={row} rowIndex={index} />;
          })}

          {!wordFound && (
            <GridRow id="activeRow" word={word} />
          )}
        </div>
      )}
    </Fragment>
  );
};

export default Grid;
