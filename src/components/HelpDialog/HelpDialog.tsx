import { FC } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, List, ListItem as MuiListItem, ListItemText, Typography, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ListItem = styled(MuiListItem)({
  display: 'list-item',
  paddingTop: 0,
  paddingBottom: 0,
});

interface HelpDialogProps {
  onClose: () => void;
}

export const HelpDialog: FC<HelpDialogProps> = ({ onClose }) => {
  return (
    <Dialog open>
      <DialogTitle>
        {'How to use'}
      </DialogTitle>
      
      <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ paddingTop: 0 }}>
        <Typography sx={{ marginBottom: '15px' }}>
          {`
            This app will help you solve a word game by presenting you a list of words 
            in the the chosen language. The word list will shrink little by little, as you enter
            the results of each letter: in the right place, in the wrong place, or not included.
          `}
        </Typography>

        <List sx={{ listStyle: 'decimal', pl: 4 }}>
          <ListItem>
            <ListItemText primary="Open your preferred game in another page and enter your word" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Return back here and enter the same word, with the results given in the game." />
          </ListItem>
        </List>
        <Typography>
          {`
            You can enter a word by typing on the displayed keyboard, or click on a word
            in the word list.
          `}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
