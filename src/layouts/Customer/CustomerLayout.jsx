import { Box, Container } from '@mui/material'
import React from 'react'
import Header from '../Website/Header'
import { Outlet } from 'react-router'
import Footer from '../Website/Footer'
import WhatsAppButton from '../Website/WhatsAppBtn'
import CustomerSideBar from '../../components/CustomerSideBar'
import OrderProcessingSection from '../../components/OrderProcessingSection'

const CustomerLayout = () => {
  return (
    <>
        
        <Header/>
        <Box sx={{ backgroundColor: "#f0f0f0" }} px={5}>
        <Container sx={{maxWidth: '1470px !important', py: 5, display: 'flex', gap: 4, alignItems: 'start'}} className='customer-dashb-target'>
            <CustomerSideBar/>
            <Outlet/>
        </Container>

          
            <br />
            <br />
            <br />
            <br />
            <br />
            </Box>
            
            <OrderProcessingSection/>
            <Footer/>
            <WhatsAppButton/>
    </>
  )
}

export default CustomerLayout
