import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Menu,
  MenuItem,
  ClickAwayListener,
  Typography,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, ' +
      'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, ' +
      'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, ' +
      'rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '20px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function SortFilterMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState('Featured');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setExpanded(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setExpanded(false);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    handleClose();
  };

  const options = [
    'Featured',
    'Best selling',
    'Alphabetically, A-Z',
    'Alphabetically, Z-A',
    'Price, low to high',
    'Price, high to low',
    'Date, old to new',
    'Date, new to old',
  ];

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div className="sort-filter-box-target acc-d-dropdown-style-target">
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          className="accordion-expand-left-filter-target"
          sx={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            borderRadius: '0 !important',
          }}
          disableGutters
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ px: 0, py: 1 }}
            id="demo-customized-button"
            aria-controls={anchorEl ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={anchorEl ? 'true' : undefined}
            onClick={handleClick}
            
          >
            <Typography sx={{fontWeight: '600', mr: 1}}>Sort by:</Typography><Typography variant="body1" className='mid-heading-select-target' sx={{mr: 1}}>{selectedOption}</Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ display: 'none' }} />
        </Accordion>

        <StyledMenu
          id="demo-customized-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          slotProps={{
            list: {
              'aria-labelledby': 'demo-customized-button',
            },
          }}
          className='dropdown-box-target'
        >
          {options.map((option) => (
            <Typography
              key={option}
              selected={selectedOption === option}
              onClick={() => handleSelect(option)}
              disableRipple
              className='menu-btn-style'
            >
              <Box className='inner-link'>{option}</Box>
            </Typography>
          ))}
        </StyledMenu>
      </div>
    </ClickAwayListener>
  );
}
