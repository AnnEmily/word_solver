import { Fragment, type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";

import GridRow from "./GridRow";
import { useTheme } from "../../shared/theme/useTheme";
import { useSolverStore } from "../../shared/solverStore";
import '../../Solver.css';


export const Grid: FC = () => {
  const wordLength = useSolverStore(useShallow(state => state.wordLength));
  
  const { theme } = useTheme();
  const className = clsx('grid', theme)

  return (
    <Fragment>
      {wordLength !== 0 && (
        <div id="grid" className={className}>
          <GridRow id="rowOne" />
        </div>
      )}
    </Fragment>
  );
};

export default Grid;
