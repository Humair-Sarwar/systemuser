import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Button, IconButton, Typography} from "@mui/material";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link, useNavigate } from "react-router";

export default function MiniBottomCartModal() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [inputData, setInputData] = useState('');

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };


  const DrawerList = (
    <Box sx={{  p: 3 }} role="presentation" className='mini-bottom-cart-panel-style'>
    <Box sx={{backgroundColor: 'rgb(224 244 232)', borderRadius: '5px', px: 2, py: 2}}><Typography sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(0 163 65)'}}><CheckCircleIcon sx={{mr: 1}}/> Added to your cart!</Typography></Box>

 <Box className='mini-cart-product-list-style' sx={{my: 1}}>
            <Box className='left-cart-image-side'>
                <img src="/playstation-5-pro-console-advanced-graphics-ultra-high-definition-image-1.png" alt="" />
            </Box>
            <Box className='right-cart-content-side'>
                <Box className='title-content'>
                    <Link to={'/'}><Typography variant="h3">PlayStation 5 Pro Console - Advanced Graphics & Ultra-High Definition Gaming Console</Typography></Link>
                    <Typography variant="body1" sx={{marginTop: '4px'}}>£600.00</Typography>
                    <Typography variant="body1">Like New</Typography>
                </Box>
               
            </Box>
        </Box>


               <Box sx={{display: 'flex', gap: '8px', mt: 1}}><Button className="custom-secondary-btn" onClick={()=>navigate('/cart')} fullWidth>View cart</Button> <Button className="custom-primary-btn" fullWidth>checkout</Button></Box>

    </Box>
  );

  return (
    <>
     






                  <Button className="add-btn" onClick={toggleDrawer(true)}>
                    <AddIcon sx={{ fontSize: "14px", fontWeight: "600" }} />{" "}
                    Quick add
                  </Button>
      <Drawer
      anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        className="mini-bottom-cart-panel-style-box-set"
      >
        {DrawerList}
      </Drawer>
    </>
  );
}
