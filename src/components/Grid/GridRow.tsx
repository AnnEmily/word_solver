import { MouseEvent, useMemo, useState, type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";
import { Button, Menu, MenuItem } from "@mui/material";

import { useTheme } from "../../shared/theme/useTheme";
import { useSolverStore } from "../../shared/solverStore";
import { LetterStatus, LETTER_STATUS, GameColors, Word } from "../../shared/types";
import { letterColors } from "../../shared/constants";
import "../../Solver.css";

const menuStyle = {
  '& .MuiMenu-list': { padding: '0px !important'},
  '& .MuiMenuItem-root': { padding: '0px !important', minHeight: '0px' },
};

const arrowStyle = {
  overflow: 'visible', // Essential so the arrow is not cut off
  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
  mt: 1, // Space for the arrow
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
  word: Word;
  isActiveWord?: boolean;
  rowIndex?: number;
}

export const GridRow: FC<GridRowProps> = ({ id, word, isActiveWord = true, rowIndex = null }) => {
  const [menuState, setMenuState] = useState<MenuState>({ anchorEl: null, cellIndex: null });

  const { activeCellIndex, wordConfirmed, colorSet, grid, setGrid, setWord, statusesConfirmed } =
    useSolverStore(
      useShallow((state) => ({
        activeCellIndex: state.activeCellIndex,
        wordConfirmed: state.wordConfirmed,
        colorSet: state.colorSet,
        grid: state.grid,
        setGrid: state.setGrid,
        setWord: state.setWord,
        statusesConfirmed: state.statusesConfirmed,
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
      return;
    };

    const newWord = word.map((cell, index) => index === menuState.cellIndex ? { ...cell, status} : cell );
    setWord(newWord);
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
  const className = clsx("gridrow", useTheme().theme);
  
  const getBgColorStyle = (status: LetterStatus) => {
    return { backgroundColor: statusColors[status] };
  };

  return (
    <div id={id} className={className}>
      <div className="row">
        {word.map((cell, index) => {
          const isActive = isActiveWord && !wordConfirmed && index === activeCellIndex;
          const enableMenu = wordConfirmed || rowIndex !== null;
          const cellClass = clsx("cell", isActive && "active", enableMenu && "clickable");
          const cellStyle = getBgColorStyle(cell.status);

          return (
            <div
              key={index}
              className={cellClass}
              style={cellStyle}
              onClick={e => enableMenu ? handleClickLetter(e, index) : null}
            >
              {cell.symbol}
            </div>
          );
        })}
      </div>

      {menuState.cellIndex !== null && (
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
            // console.log('not isActiveWord', !isActiveWord);
            // console.log('menuState.cellIndex', menuState.cellIndex);
            // console.log('rowIndex', rowIndex);
            // if (menuState.cellIndex !== undefined && rowIndex !== null ) {
            //   console.log('grid[rowIndex][menuState.cellIndex]', grid[rowIndex][menuState.cellIndex]);
            // }
            // console.log('status', status);

            if (!isActiveWord && grid[rowIndex][menuState.cellIndex].status !== status) {
              // For an inactive word, skip status if it is not the current status of the letter
              return null;
            }

            // For an active word, display all options
            const menuItemStyle = getBgColorStyle(status);
            return (
              <MenuItem
                key={status}
                disabled={statusesConfirmed}
                onClick={() => isActiveWord ? handleSelectStatus(status) : handleCloseMenu()}
                sx={{ opacity: '1 !important', cursor: isActiveWord ? 'pointer' : 'default' }}
              >
                <div className="status-entry" style={menuItemStyle}>
                  {STATUS_LABELS[status]}
                </div>
              </MenuItem>
            );
          })}
        </Menu>
      )}

      {isActiveWord && wordConfirmed && colorSet && !statusesConfirmed && (            
        <div className="msg">
          <div className="warning">{"Click on each letter to set its status"}</div>
          
          {word.every(letter => letter.status) && (
            <Button
              variant="contained"
              className="button"
              sx={{ width: 'auto', marginTop: '10px' }}
              onClick={() => setGrid(word)}
            >
              {"Done"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default GridRow;
