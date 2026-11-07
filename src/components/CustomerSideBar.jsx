import { Box, Typography } from '@mui/material'
import React from 'react'
import { NavLink } from 'react-router'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from '@mui/icons-material/Person';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const CustomerSideBar = () => {
  return (
    <>
        <Box className='c-sidebar-target' sx={{backgroundColor: 'white', borderRadius: '10px', width: '350px', p: 3, boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'}}>
        <Box>
            <Typography variant='h5' sx={{fontSize: '12px', textTransform: 'uppercase', color: '#636363ff'}}>Dashboard</Typography>
            <Box>
                <NavLink className={({ isActive }) => (isActive ? "active-link-cutomer" : "inactive-link-cutomer")} to={'/buy/orders'} style={{marginTop: '15px', display: 'block'}}><Box sx={{display: 'flex', alignItems: 'center'}}><ShoppingBagIcon sx={{fontSize: '19px', mr: 1}}/> <Typography sx={{fontSize: '14px'}}>Sale Orders</Typography></Box></NavLink>
                                <NavLink className={({ isActive }) => (isActive ? "active-link-cutomer" : "inactive-link-cutomer")} to={'/wishlist'} style={{marginTop: '15px', display: 'block'}}><Box sx={{display: 'flex', alignItems: 'center'}}><FavoriteBorderIcon sx={{fontSize: '19px', mr: 1}}/> <Typography sx={{fontSize: '14px'}}>Wishlist</Typography></Box></NavLink>

            </Box>
        </Box>
        <Box sx={{mt: 4}}>
            <Typography variant='h5' sx={{fontSize: '12px', textTransform: 'uppercase', color: '#636363ff'}}>ACCOUNT SETTINGS

</Typography>
            <Box>
                <NavLink className={({ isActive }) => (isActive ? "active-link-cutomer" : "inactive-link-cutomer")} to={'/profile'} style={{marginTop: '15px', display: 'block'}}><Box sx={{display: 'flex', alignItems: 'center'}}><PersonIcon sx={{fontSize: '19px', mr: 1}}/> <Typography sx={{fontSize: '14px'}}>Profile Info</Typography></Box></NavLink>
                                <NavLink className={({ isActive }) => (isActive ? "active-link-cutomer" : "inactive-link-cutomer")} to={'/gift-cards'} style={{marginTop: '15px', display: 'block'}}><Box sx={{display: 'flex', alignItems: 'center'}}><CardGiftcardIcon sx={{fontSize: '19px', mr: 1}}/> <Typography sx={{fontSize: '14px'}}>Gift Cards</Typography></Box></NavLink>
                                <NavLink className={({ isActive }) => (isActive ? "active-link-cutomer" : "inactive-link-cutomer")} to={'/addresses'} style={{marginTop: '15px', display: 'block'}}><Box sx={{display: 'flex', alignItems: 'center'}}><LocationPinIcon sx={{fontSize: '19px', mr: 1}}/> <Typography sx={{fontSize: '14px'}}>Addresses</Typography></Box></NavLink>

            </Box>
        </Box>
        </Box>
    </>
  )
}

export default CustomerSideBar
