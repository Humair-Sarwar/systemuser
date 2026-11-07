import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IconButton, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";

export default function SearchModal() {
  const [open, setOpen] = React.useState(false);
  const [inputData, setInputData] = useState('');

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

const handleChangeSearch = (e) => {
    setInputData(e.target.value);
}

const handleClearInput = ()=>{
    setInputData('');
}
  const DrawerList = (
    <Box sx={{ width: 600, p: 4 }} role="presentation" className='inner-modal-search-view-set'>
    
      <Box className='search-row'>
        <input type="text" placeholder="Search for..." onChange={handleChangeSearch} value={inputData}/>
        <Box className='right-clear-close-btn-style'>
            {inputData != '' && <Box className='clear-modal-input-data' sx={{mr: 2, cursor: 'pointer'}} onClick={handleClearInput}>Clear</Box>}
            
        <Box className='close-modal-button' onClick={toggleDrawer(false)}><CloseIcon/></Box>
        </Box>
      </Box>
      <Box sx={{height: '100%', width: '100%', position: 'relative'}}>
            <Typography sx={{fontWeight: '500', textWrap: 'nowrap', fontSize: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>No results could be found.

</Typography>
      </Box>

       
    </Box>
  );

  return (
    <>
     




       <IconButton  onClick={toggleDrawer(true)}
                    size="large"
                    color="black"
                  >
                    <svg
                      role="presentation"
                      stroke-width="1.5"
                      focusable="false"
                      width="22"
                      height="22"
                      class="icon icon-search"
                      viewBox="0 0 22 22"
                    >
                      <circle
                        cx="11"
                        cy="10"
                        r="7"
                        fill="none"
                        stroke="currentColor"
                      ></circle>
                      <path
                        d="m16 15 3 3"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </IconButton>
      <Drawer
      anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        className="search-modal-panel-style-set"
      >
        {DrawerList}
      </Drawer>
    </>
  );
}
