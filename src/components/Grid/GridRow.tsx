import { MouseEvent, useMemo, useState, type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";
import { Menu, MenuItem } from "@mui/material";

import { useTheme } from "../../shared/theme/useTheme";
import { useSolverStore } from "../../shared/solverStore";
import { LetterStatus, LETTER_STATUS, GameColors } from "../../shared/types";
import { letterColors } from "../../shared/constants";
import "../../Solver.css";

const menuStyle = {
  '& .MuiMenu-list': { padding: '0px !important'},
  '& .MuiMenuItem-root': { padding: '0px !important'},
};

const arrowStyle = {
  overflow: 'visible', // Essential so the arrow is not cut off
  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
  mt: 1.5, // Space for the arrow
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 10,
    height: 10,
    bgcolor: 'background.paper',
    transform: 'translate(-50%, -50%) rotate(45deg)',
    zIndex: 0,
  },
};

type MenuState = {
  anchorEl: HTMLElement | null;
  cellIndex: number | null;
};

const STATUS_LABELS: Record<LetterStatus, string> = {
  rightPlace: "Letter in right place",
  wrongPlace: "Letter in wrong place",
  notIncluded: "Letter not included",
};

interface GridRowProps {
  id: string;
}

export const GridRow: FC<GridRowProps> = ({ id }) => {
  const [menuState, setMenuState] = useState<MenuState>({ anchorEl: null, cellIndex: null });

  const { activeCellIndex, wordConfirmed, colorSet, letters, setLetters } =
    useSolverStore(
      useShallow((state) => ({
        activeCellIndex: state.activeCellIndex,
        wordConfirmed: state.wordConfirmed,
        colorSet: state.colorSet,
        letters: state.letters,
        setLetters: state.setLetters,
      }))
    );

  const handleClickLetter = (event: MouseEvent<HTMLElement>, index: number) => {
    setMenuState({ anchorEl: event.currentTarget, cellIndex: index });
  };

  const handleCloseMenu = () => {
    setMenuState({ anchorEl: null, cellIndex: null });
  };

  const handleSelectStatus = (status: LetterStatus) => {
    if (menuState.cellIndex === null) {
      return
    };

    const newLetters = letters.map((cell, index) => index === menuState.cellIndex ? { ...cell, status} : cell );
    setLetters(newLetters);
    handleCloseMenu();
  };

  const letterColorsBySet: Record<GameColors, Record<LetterStatus, string>> =
    Object.fromEntries(
      letterColors.map(({ colorSet, rightPlace, wrongPlace, notIncluded }) => [
        colorSet, { rightPlace, wrongPlace, notIncluded }
      ])
  ) as Record<GameColors, Record<LetterStatus, string>>;
  
  const statusColors = useMemo<Record<LetterStatus, string>>(() => {
    const set: GameColors = colorSet ?? 'default';
    return letterColorsBySet[set];
  }, [colorSet, letterColorsBySet]);

  const open = Boolean(menuState.anchorEl);
  const activeCell = menuState.cellIndex !== null ? letters[menuState.cellIndex] : null;
  const className = clsx("gridrow", useTheme().theme);

  return (
    <div id={id} className={className}>
      {letters.map((cell, index) => {
        const isActive = !wordConfirmed && index === activeCellIndex;
        const cellClass = clsx("cell", isActive && "active");

        return (
          <div key={index} className={cellClass} onClick={(e) => handleClickLetter(e, index)}>
            {cell.symbol}
          </div>
        );
      })}

      <Menu
        open={open}
        anchorEl={menuState.anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        sx={menuStyle}
        slotProps={{ paper: { sx: arrowStyle } }}
      >
        {LETTER_STATUS.map((status) => {
          const bgColor = statusColors[status];
          return (
            <MenuItem
              key={status}
              selected={activeCell?.status === status}
              onClick={() => handleSelectStatus(status)}
            >
              <div style={{ backgroundColor: bgColor, width: '100%', padding: '4px 8px', margin: '2px', borderRadius: '4px' }}>
                {STATUS_LABELS[status]}
              </div>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default GridRow;
