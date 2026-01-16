import { MouseEvent, useEffect, useMemo, useState, type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";
import { Button, Menu, MenuItem } from "@mui/material";

import { useTheme } from "../../shared/theme/useTheme";
import { useSolverStore } from "../../shared/store";
import { LetterStatus, Word } from "../../shared/types";
import { getAllowedStatuses, getBgColorStyle } from "./utils";
import "../../Solver.css";

const menuStyle = {
  '& .MuiMenu-list': { padding: '0px !important' },
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

  const {
    activeCellIndex,
    candidateLetters,
    grid,
    wordConfirmed,
    colorSet,
    setActiveCellIndex,
    setGrid,
    setWord,
    statusesConfirmed,
    wordListInView,
  } =
    useSolverStore(
      useShallow((state) => ({
        activeCellIndex: state.activeCellIndex,
        candidateLetters: state.candidateLetters,
        wordConfirmed: state.wordConfirmed,
        colorSet: state.colorSet,
        grid: state.grid,
        setActiveCellIndex: state.setActiveCellIndex,
        setGrid: state.setGrid,
        setWord: state.setWord,
        statusesConfirmed: state.statusesConfirmed,
        wordListInView: state.wordListInView,
      }))
    );

  const handleClickLetter = (event: MouseEvent<HTMLElement>, index: number) => {
    if (wordConfirmed || rowIndex !== null) {
      setMenuState({ anchorEl: event.currentTarget, cellIndex: index });
    } else {
      setActiveCellIndex(index);
    }
  };

  const handleCloseMenu = () => {
    setMenuState({ anchorEl: null, cellIndex: null });
  };

  const handleSelectStatus = (status: LetterStatus) => {
    const newWord = word.map((cell, index) => index === menuState.cellIndex ? { ...cell, status } : cell );
    setWord(newWord);
    handleCloseMenu();
  };

  const contradictoryletter = useMemo((): string => {
    // Make sure no letter is declared both included and excluded
    const includedLetters = word
      .filter(letter => ['rightPlace', 'wrongPlace'].includes(letter.status))
      .map(letter => letter.symbol);
    const excludedLetters = word
      .filter(letter => letter.status === 'notIncluded')
      .map(letter => letter.symbol);
    return includedLetters.filter(value => excludedLetters.includes(value)).pop();
  }, [word]);

  const allowedStatuses = useMemo((): Record<number, LetterStatus[]> => {
    return Object.fromEntries(word.map((_, index) => [
      index,
      getAllowedStatuses(index, rowIndex, word, grid, candidateLetters),
    ]));
  }, [rowIndex, word, grid, candidateLetters]);

  useEffect(() => {
    // If we are sure of the status of an uncomitted letter, set it
    if (word.some(letter => letter.status === null)) {
      let statusChange = false;

      Object.entries(allowedStatuses).forEach(([index, statusArray]) => {
        if (statusArray.length === 1 && word[index].status === null) {
          statusChange = true;
          word[index].status = statusArray[0];
        }
      });

      if (statusChange) {
        setWord(word);
      }
    }
  }, [allowedStatuses, word, setWord]);

  const open = Boolean(menuState.anchorEl);
  const className = clsx("gridrow", useTheme().theme);
  const allStatusesSet = word.every(letter => letter.status);

  return (
    <div id={id} className={className}>
      <div className="row">
        {word.map((cell, index) => {
          const isActive = isActiveWord && !wordConfirmed && index === activeCellIndex;
          const cellClass = clsx("cell", isActive && "active", "clickable");
          const cellStyle = getBgColorStyle(cell.status, colorSet);

          return (
            <div key={index} className={cellClass} style={cellStyle} onClick={e => handleClickLetter(e, index)}>
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
          {allowedStatuses[menuState.cellIndex].map((status) => {
            const menuItemStyle = getBgColorStyle(status, colorSet);
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

      <div className="msg" style={{ display: isActiveWord ? 'inherit' : 'none' }}>
        {!wordListInView && <div className="warning">{"Collapse the Seetings panel to view the word list"}</div>}

        {wordConfirmed && !colorSet && <div className="warning">{"You need to select a color set"}</div>}

        {isActiveWord && wordConfirmed && colorSet && !statusesConfirmed && !contradictoryletter && (
          <>
            {!allStatusesSet && (
              <div className="info">{"Click on each letter to set its status"}</div>
            )}
            
            {allStatusesSet && (
              <Button
                variant="contained"
                className="button"
                sx={{ width: 'auto' }}
                onClick={() => setGrid(word)}
              >
                {"Done"}
              </Button>
            )}
          </>
        )}

        {contradictoryletter && (
          <div className="error">{`Letter ${contradictoryletter} cannot be both included and excluded from the word`}</div>
        )}
      </div>
    </div>
  );
};

export default GridRow;
