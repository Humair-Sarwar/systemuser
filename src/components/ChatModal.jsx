import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

export default function ChatModal() {
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
    <Box sx={{ width: 400, p: 1 }} role="presentation" className='inner-modal-search-view-set'>
    
   <Box sx={{height: '94vh', width: '100%', backgroundColor: '#f0f0f0', p: 1, borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
    <Box>
        <Box sx={{display: 'flex', justifyContent: 'start', mb: 2}}>
            <Box sx={{backgroundColor: 'orangeRed', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '20px'}}>H</Box>
            <Box sx={{backgroundColor: 'white', boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', width: '65%', ml: 1, p: 1, borderTopLeftRadius: '8px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px'}}><Typography sx={{fontSize: '15px'}}>Hi! Humair. How are you?</Typography>
            <Typography sx={{textAlign: 'end', fontSize: '11px', color: '#6d6d6dff'}}>10:20 PM</Typography></Box>
       
        </Box>
         <Box sx={{display: 'flex', justifyContent: 'end', flexDirection: 'row-reverse'}}>
            <Box sx={{backgroundColor: 'green', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '20px'}}>A</Box>
            <Box sx={{backgroundColor: 'rgb(249, 245, 255)', boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', border: '1px solid rgb(166, 23, 240)', width: '65%', mr: 1, p: 1, borderTopLeftRadius: '8px', borderTopRightRadius: '8px', borderBottomLeftRadius: '8px'}}><Typography sx={{fontSize: '15px'}}>I'm fine. What about you?</Typography>
            <Typography sx={{textAlign: 'end', fontSize: '11px', color: '#6d6d6dff'}}>10:23 PM</Typography></Box>
       
        </Box>
    </Box>
    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <TextField
                    fullWidth
                  id="outlined-multiline-static"
                  label="Write Your Message..."
                  multiline
                  rows={1}
                  size='small'
                  color="secondary"
                //   className="note-textarea-box-style"
                sx={{backgroundColor: 'white', mr: 1}}
                />
                <Button variant="contained" sx={{backgroundColor: '#5808ff'}}><SendIcon/></Button>
    </Box>
   </Box>

       
    </Box>
  );

  return (
    <>

<Button
          className="custom-primary-btn-admin-side"
          onClick={toggleDrawer(true)}
          sx={{whiteSpace: 'nowrap', ml: 1, mb: 1}}
        >
          <ChatIcon sx={{mr: 1}}/> Contact
        </Button>

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
