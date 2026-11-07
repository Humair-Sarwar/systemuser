import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Button, IconButton, TextField, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import Badge from "@mui/material/Badge";
import { Link } from "react-router";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export default function MiniAddToCartModal() {
  const [open, setOpen] = React.useState(false);

  const [showHideNotes, setShowHideNotes] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

const handleShowNotesBox = () => {
    setShowHideNotes(true);
}

const handleCloseNoteBox = () => {
    setShowHideNotes(false);
}


  const DrawerList = (
    <Box sx={{ width: 640 }} role="presentation" className='mini-cart-panel-main-box-style'>
    
     <Box sx={{p: 3}} className='mini-cart-top-section-style'>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><Typography sx={{display: 'flex', fontWeight: '600', fontSize: '20px', alignItems: 'center'}}>Cart <Box sx={{backgroundColor: 'black', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '13px', fontWeight: '600', ml: 1}}>3</Box></Typography>
            <Box sx={{cursor: 'pointer'}} onClick={toggleDrawer(false)}><CloseIcon/></Box>
        </Box>





        <Box className='mini-cart-product-list-style'>
            <Box className='left-cart-image-side'>
                <img src="/playstation-5-pro-console-advanced-graphics-ultra-high-definition-image-1.png" alt="" />
            </Box>
            <Box className='right-cart-content-side'>
                <Box className='title-content'>
                    <Link to={'/'}><Typography variant="h3">PlayStation 5 Pro Console - Advanced Graphics & Ultra-High Definition Gaming Console</Typography></Link>
                    <Typography variant="body1" sx={{marginTop: '4px'}}>£600.00</Typography>
                    <Typography variant="body1">Like New</Typography>
                </Box>
                <Box sx={{textAlign: 'center'}} className='inner-right-rmv-row'>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className='inc-dec-btn-row'>
                        <Button className="dec"><RemoveIcon sx={{fontSize: '20px'}}/></Button>
                        <input type="number" />
                          <Button className="inc"><AddIcon sx={{fontSize: '20px'}}/></Button>
                    </Box>
                    <Typography className="rmv-btn-style">Remove</Typography>
                </Box>
            </Box>
        </Box>

        <Box className='mini-cart-product-list-style'>
            <Box className='left-cart-image-side'>
                <img src="/apple-airpods-4-with-adaptive-audio-usb-c-active-noise-cancellation-wireless-earbuds-image-7.png" alt="" />
            </Box>
            <Box className='right-cart-content-side'>
                <Box className='title-content'>
                    <Link to={'/'}><Typography variant="h3">PlayStation 5 Pro Console - Advanced Graphics & Ultra-High Definition Gaming Console</Typography></Link>
                    <Typography variant="body1" sx={{marginTop: '4px'}}>£600.00</Typography>
                    <Typography variant="body1">Like New</Typography>
                </Box>
                <Box sx={{textAlign: 'center'}} className='inner-right-rmv-row'>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className='inc-dec-btn-row'>
                        <Button className="dec"><RemoveIcon sx={{fontSize: '20px'}}/></Button>
                        <input type="number" />
                          <Button className="inc"><AddIcon sx={{fontSize: '20px'}}/></Button>
                    </Box>
                    <Typography className="rmv-btn-style">Remove</Typography>
                </Box>
            </Box>
        </Box>

        <Box className='mini-cart-product-list-style'>
            <Box className='left-cart-image-side'>
                <img src="/apple-watch-series-10-gps-42mm-rose-gold-aluminium-case-smartwatch-1.png" alt="" />
            </Box>
            <Box className='right-cart-content-side'>
                <Box className='title-content'>
                    <Link to={'/'}><Typography variant="h3">PlayStation 5 Pro Console - Advanced Graphics & Ultra-High Definition Gaming Console</Typography></Link>
                    <Typography variant="body1" sx={{marginTop: '4px'}}>£600.00</Typography>
                    <Typography variant="body1">Like New</Typography>
                </Box>
                <Box sx={{textAlign: 'center'}} className='inner-right-rmv-row'>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className='inc-dec-btn-row'>
                        <Button className="dec"><RemoveIcon sx={{fontSize: '20px'}}/></Button>
                        <input type="number" />
                          <Button className="inc"><AddIcon sx={{fontSize: '20px'}}/></Button>
                    </Box>
                    <Typography className="rmv-btn-style">Remove</Typography>
                </Box>
            </Box>
        </Box>
 <Box className='mini-cart-product-list-style'>
            <Box className='left-cart-image-side'>
                <img src="/apple-watch-series-10-gps-42mm-rose-gold-aluminium-case-smartwatch-1.png" alt="" />
            </Box>
            <Box className='right-cart-content-side'>
                <Box className='title-content'>
                    <Link to={'/'}><Typography variant="h3">PlayStation 5 Pro Console - Advanced Graphics & Ultra-High Definition Gaming Console</Typography></Link>
                    <Typography variant="body1" sx={{marginTop: '4px'}}>£600.00</Typography>
                    <Typography variant="body1">Like New</Typography>
                </Box>
                <Box sx={{textAlign: 'center'}} className='inner-right-rmv-row'>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className='inc-dec-btn-row'>
                        <Button className="dec"><RemoveIcon sx={{fontSize: '20px'}}/></Button>
                        <input type="number" />
                          <Button className="inc"><AddIcon sx={{fontSize: '20px'}}/></Button>
                    </Box>
                    <Typography className="rmv-btn-style">Remove</Typography>
                </Box>
            </Box>
        </Box>
         <Box className='mini-cart-product-list-style'>
            <Box className='left-cart-image-side'>
                <img src="/apple-watch-series-10-gps-42mm-rose-gold-aluminium-case-smartwatch-1.png" alt="" />
            </Box>
            <Box className='right-cart-content-side'>
                <Box className='title-content'>
                    <Link to={'/'}><Typography variant="h3">PlayStation 5 Pro Console - Advanced Graphics & Ultra-High Definition Gaming Console</Typography></Link>
                    <Typography variant="body1" sx={{marginTop: '4px'}}>£600.00</Typography>
                    <Typography variant="body1">Like New</Typography>
                </Box>
                <Box sx={{textAlign: 'center'}} className='inner-right-rmv-row'>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className='inc-dec-btn-row'>
                        <Button className="dec"><RemoveIcon sx={{fontSize: '20px'}}/></Button>
                        <input type="number" />
                          <Button className="inc"><AddIcon sx={{fontSize: '20px'}}/></Button>
                    </Box>
                    <Typography className="rmv-btn-style">Remove</Typography>
                </Box>
            </Box>
        </Box>

      








     </Box>
    <Box sx={{p: 3, position: 'relative'}} className='mini-cart-footer-section-style'>
{showHideNotes && <Box className='add-note-box-style-target' sx={{p: 3}}>
    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
            <Typography variant="h4" sx={{fontSize: '22px', fontWeight: '600'}}>Order note</Typography>

          <Box sx={{cursor: 'pointer'}} onClick={handleCloseNoteBox}><CloseIcon/></Box>
        </Box>




            <TextField
            fullWidth
          id="outlined-multiline-static"
          label="Order note"
          multiline
          rows={4}
          className="note-textarea-box-style"
        />
        <Button className="custom-secondary-btn" sx={{mt: 2}}>save</Button>
        </Box>}
        
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="h4" sx={{fontSize: '22px', fontWeight: '600'}}>Total</Typography>

            <Typography variant="h4" sx={{fontSize: '22px', fontWeight: '500'}}>£1,168.00 GBP
</Typography>
        </Box>
        <Typography variant="body1" sx={{fontSize: '14px', color: 'rgb(26 26 26 / 70%)'}}>Tax included. <Link to={'/'} className="shipping-link-page-style">Shipping</Link> calculated at checkout.</Typography>
        <Typography variant="body1" sx={{fontSize: '14px', color: 'rgb(26 26 26 / 70%)'}}><Box className="add-order-note-btn" onClick={handleShowNotesBox}>Add order note</Box></Typography>
        <Box sx={{display: 'flex', gap: '8px', mt: 1}}><Button className="custom-secondary-btn" fullWidth>View cart</Button> <Button className="custom-primary-btn" fullWidth>checkout</Button></Box>
    </Box>
       
    </Box>
  );

  return (
    <>
     







<IconButton
onClick={toggleDrawer(true)}
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <Badge
                      badgeContent={1}
                      color="secondary"
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "black",
                          color: "white", // optional: make text readable
                          fontSize: "0.60rem",
                          minWidth: "16px",
                          height: "17px",
                          fontWeight: "700",
                        },
                      }}
                    >
                      <svg
                        role="presentation"
                        stroke-width="1.5"
                        focusable="false"
                        width="22"
                        height="22"
                        class="icon icon-cart"
                        viewBox="0 0 22 22"
                      >
                        <path
                          d="M9.182 18.454a.91.91 0 1 1-1.818 0 .91.91 0 0 1 1.818 0Zm7.272 0a.91.91 0 1 1-1.818 0 .91.91 0 0 1 1.819 0Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M5.336 6.636H21l-3.636 8.182H6.909L4.636 3H1m8.182 15.454a.91.91 0 1 1-1.818 0 .91.91 0 0 1 1.818 0Zm7.272 0a.91.91 0 1 1-1.818 0 .91.91 0 0 1 1.819 0Z"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </Badge>
                  </IconButton>



      <Drawer
      anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        className="mini-cart-drawer-panel-style"
      >
        {DrawerList}
      </Drawer>
    </>
  );
}
