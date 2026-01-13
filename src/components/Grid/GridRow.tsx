import { MouseEvent, useMemo, useState, type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";
import { Button, Menu, MenuItem } from "@mui/material";

import { useTheme } from "../../shared/theme/useTheme";
import { useSolverStore } from "../../shared/store";
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

  const { activeCellIndex, candidateLetters, grid, wordConfirmed, colorSet, setGrid, setWord, statusesConfirmed } =
    useSolverStore(
      useShallow((state) => ({
        activeCellIndex: state.activeCellIndex,
        candidateLetters: state.candidateLetters,
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
    const newWord = word.map((cell, index) => index === menuState.cellIndex ? { ...cell, status} : cell );
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

  // AEG move outside ?
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

  const getBgColorStyle = (status: LetterStatus) => {
    return { backgroundColor: statusColors[status] };
  };

  // const allowedStatuses = useMemo((): LetterStatus[] => {
  //   // if (menuState.cellIndex !== null) {
  //     const cellIndex = menuState.cellIndex;

  //     if (!isActiveWord) {
  //       // User clicked in a grid cell
  //       return [grid[rowIndex][cellIndex].status];
  //     }

  //     // User clicked in a word cell
  //     const letter = word[cellIndex];

  //     // If symbol is not found in any candidates, it was rejected before
  //     const allSymbols = candidateLetters.flatMap(cl => cl.symbols);
  //     const symbolNotFound = allSymbols.find(s => s === letter.symbol) === undefined;
  //     if (symbolNotFound) {
  //       console.log('path A');
  //       return ['notIncluded'];
  //     }

  //     const unsureEntries = candidateLetters.filter(cl => cl.symbols.length > 1);

  //     // Case of a cell whose symbol is in rightPLace
  //     if (candidateLetters[cellIndex].symbols.length === 1) {
  //       if (candidateLetters[cellIndex].symbols.includes(letter.symbol)) {
  //         console.log('path F1');
  //         return ['rightPlace'];
  //       }

  //       if (!unsureEntries.every(entry => entry.symbols.includes(letter.symbol))) {
  //         // That symbol was declared wrong place befoe, then it still is
  //         console.log('path F2');
  //         return ['wrongPlace'];
  //       }

  //       // That symbol was never teste before
  //       console.log('path F3');
  //       return ['wrongPlace', 'notIncluded'];
  //     }

      
  //     const sureEntries = candidateLetters.filter(cl => cl.symbols.length === 1);

  //     // Considering letters that were declared in the right place before
  //     if (sureEntries.some(entry => entry.symbols.includes(letter.symbol))) {
  //       if (candidateLetters[cellIndex].symbols.length === 1 && candidateLetters[cellIndex].symbols[0] === letter.symbol) {
  //         console.log('path B1');
  //         return ['rightPlace'];
  //       } else {
  //         console.log('path B2');
  //         return ['rightPlace', 'wrongPlace'];
  //       }
  //     }

  //     // Case of a symbol that was never submitted
  //     if (unsureEntries.every(entry => entry.symbols.includes(letter.symbol))) {
  //       console.log('path C');
  //       return ['rightPlace', 'wrongPlace', 'notIncluded'];
  //     }

  //     const unsureContainingSymbol = unsureEntries.filter(entry => entry.symbols.includes(letter.symbol));

  //     // Case of a symbol that was declared wrong, but is in fact left in only one candidate
  //     if (unsureContainingSymbol.length === 1) {
  //       if (unsureContainingSymbol[0].cellIndex === cellIndex) {
  //         console.log('path D1');
  //         return ['rightPlace'];
  //       } else {
  //         console.log('path D2');
  //         return ['wrongPlace'];
  //       }
  //     }

  //     // Case of a symbol that was declared wrong, but that is left in many candidate

  //     if (unsureContainingSymbol.length > 1) {
  //         console.log('path E');
  //         return ['rightPlace', 'wrongPlace'];
  //     }
  //   // }

  //   console.log('path default');
  //   return [...LETTER_STATUS];
  // }, [menuState.cellIndex, word, isActiveWord, candidateLetters, grid, rowIndex]);

  const getAllowedStatuses = (cellIndex: number): LetterStatus[] => {
    if (rowIndex !== null) {
      // User clicked in a grid cell
      return [grid[rowIndex][cellIndex].status];
    }

    // User clicked in a word cell
    const letter = word[cellIndex];

    // If symbol is not found in any candidates, it was rejected before
    const allSymbols = candidateLetters.flatMap(cl => cl.symbols);
    const symbolNotFound = allSymbols.find(s => s === letter.symbol) === undefined;
    if (symbolNotFound) {
      console.log('path A');
      return ['notIncluded'];
    }

    const unsureEntries = candidateLetters.filter(cl => cl.symbols.length > 1);

    // Case of a cell whose symbol is in rightPLace
    if (candidateLetters[cellIndex].symbols.length === 1) {
      if (candidateLetters[cellIndex].symbols.includes(letter.symbol)) {
        console.log('path F1');
        return ['rightPlace'];
      }

      if (!unsureEntries.every(entry => entry.symbols.includes(letter.symbol))) {
        // That symbol was declared wrong place befoe, then it still is
        console.log('path F2');
        return ['wrongPlace'];
      }

      // That symbol was never teste before
      console.log('path F3');
      return ['wrongPlace', 'notIncluded'];
    }

    
    const sureEntries = candidateLetters.filter(cl => cl.symbols.length === 1);

    // Considering letters that were declared in the right place before
    if (sureEntries.some(entry => entry.symbols.includes(letter.symbol))) {
      if (candidateLetters[cellIndex].symbols.length === 1 && candidateLetters[cellIndex].symbols[0] === letter.symbol) {
        console.log('path B1');
        return ['rightPlace'];
      } else {
        console.log('path B2');
        return ['rightPlace', 'wrongPlace'];
      }
    }

    // Case of a symbol that was never submitted
    if (unsureEntries.every(entry => entry.symbols.includes(letter.symbol))) {
      console.log('path C');
      return ['rightPlace', 'wrongPlace', 'notIncluded'];
    }

    const unsureContainingSymbol = unsureEntries.filter(entry => entry.symbols.includes(letter.symbol));

    // Case of a symbol that was declared wrong, but is in fact left in only one candidate
    if (unsureContainingSymbol.length === 1) {
      if (unsureContainingSymbol[0].cellIndex === cellIndex) {
        console.log('path D1');
        return ['rightPlace'];
      } else {
        console.log('path D2');
        return ['wrongPlace'];
      }
    }

    // Case of a symbol that was declared wrong, but that is left in many candidate

    if (unsureContainingSymbol.length > 1) {
        console.log('path E');
        return ['rightPlace', 'wrongPlace'];
    }

    console.log('path default');
    return [...LETTER_STATUS];
  };

  const open = Boolean(menuState.anchorEl);
  const className = clsx("gridrow", useTheme().theme);

  console.log('candidateLetters', candidateLetters);

  return (
    <div id={id} className={className}>
      <div className="row">
        {word.map((cell, index) => {
          const isActive = isActiveWord && !wordConfirmed && index === activeCellIndex;
          const enableMenu = wordConfirmed || rowIndex !== null;
          const cellClass = clsx("cell", isActive && "active", enableMenu && "clickable");
          const allowedStatuses = getAllowedStatuses(index);
          const status = cell.status !== null ? cell.status : allowedStatuses.length === 1 ? allowedStatuses[0] : null;
          const cellStyle = getBgColorStyle(status);

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
          {/* {allowedStatuses.map((status) => { */}
          {getAllowedStatuses(menuState.cellIndex).map((status) => {
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

      {isActiveWord && wordConfirmed && colorSet && !statusesConfirmed && !contradictoryletter && (            
        <div className="msg">
          <div className="info">{"Click on each letter to set its status"}</div>
          
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

      {contradictoryletter && (
        <div className="msg">
          <div className="error">{`Letter ${contradictoryletter} cannot be both included and excluded from the word`}</div>
        </div>        
      )}
    </div>
  );
};

export default GridRow;
