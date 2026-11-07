import { Box } from '@mui/material'
import React from 'react'
import Header from '../Website/Header/index'
import Footer from '../Website/Footer/index'
import WhatsAppButton from '../Website/WhatsAppBtn/index'

import { Outlet } from 'react-router'

const WebsiteLayout = () => {
  return (
    <>
        <Box>
            <Header/>
            <Outlet/>
            <Footer/>
            <WhatsAppButton/>
        </Box>
    </>
  )
}

export default WebsiteLayout