import { JSX, ReactNode } from 'react';
import { sortBy, uniq, uniqBy } from 'lodash';
import CountryFlag from "react-country-flag"
import { MenuItem } from '@mui/material';

import { games, letterColors } from '../../shared/constants';
import { LanguageCode, GameSet } from '../../shared/types';
import { languageCodeToName } from '../../shared/utilsString';

export const getArrayOptions = (src: number[]): JSX.Element[] => {
    const uniqValues = uniq(src).map(v => v.toString()).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    return uniqValues.map(val => (
      <MenuItem key={val} value={val}>
        {val}
      </MenuItem>
    ));
  };

export const getGameOptions = (field: keyof GameSet): JSX.Element[] => {
  const ColorBadge = ( p: { color: string }) => {
    return <div className="color-badge" style={{ backgroundColor: p.color }} />;
  };

  const shortEntries = games.map(g => ({
    field: field !== 'languageCode' ? g[field].toString() : languageCodeToName(g[field] as LanguageCode),
    country: g.country,
    colorSet: g.colorSet,
  }));

  const uniqEntries = uniqBy(shortEntries, 'field');
  const sortedEntries = sortBy(uniqEntries, entry => entry.field.toLowerCase());

  return sortedEntries.map(entry => {
    let element: ReactNode = entry.field;

    if (field === 'name') {
      element = <><CountryFlag countryCode={entry.country} svg style={{ width: '20px', paddingRight: '10px' }}/><div>{entry.field}</div></>;
    } else if (field === 'colorSet') {
      const colorSet = letterColors.find(lc => lc.colorSet === entry.colorSet);

      element = (
        <>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center', paddingRight: '10px' }}>
            <ColorBadge color={colorSet?.colors.includedRight} />
            <ColorBadge color={colorSet?.colors.includedWrong} />
            <ColorBadge color={colorSet?.colors.notIncluded} />
          </div>
          <div>{entry.field}</div>
        </>
      );
    }

    return (
      <MenuItem key={entry.field} value={entry.field}>
        {element}
      </MenuItem>
    );
  });
};
