import { Box, Container, Grid, Typography } from '@mui/material'
import React from 'react'

const OrderProcessingSection = () => {
  return (
    <>
        <Box sx={{backgroundColor: "#f0f0f0", py: 5}}>
            <Container sx={{maxWidth: '1470px !important'}}>
                <Grid container spacing={4}>
                  <Grid size={{xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <Box sx={{textAlign: 'center'}}>
                        <svg role="presentation" fill="none" focusable="false" stroke-width="1.5" width="24" height="24" class="hidden sm:block icon icon-picto-truck" viewBox="0 0 24 24">
        <path d="M19 17.798h1.868a1.714 1.714 0 0 0 1.715-1.715V11.25a3.274 3.274 0 0 0-3.275-3.274H14.395l-.097 7.869" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M8.71 18.175c1.565 0 3.094-.16 4.572-.321m-9.94-.087a1.78 1.78 0 0 1-1.576-1.56c-.189-1.594-.407-3.256-.407-4.96 0-1.705.216-3.366.405-4.96a1.783 1.783 0 0 1 1.577-1.56c1.725-.186 3.523-.409 5.37-.409s3.644.223 5.368.408a1.783 1.783 0 0 1 1.578 1.56c.066.564.136 1.135.199 1.714" stroke="currentColor"></path>
        <path d="M16.061 21.069a2.894 2.894 0 1 1 0-5.793 2.894 2.894 0 0 1 0 5.794v-.001ZM5.832 21.069a2.894 2.894 0 1 1 0-5.792 2.894 2.894 0 0 1 0 5.793v-.001Z" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <Typography variant='h3' sx={{fontSize: '20px', fontWeight: '600', my: 3}}>Fast Order Processing</Typography>
      <Typography variant='body1'>Efficient order processing within 24 working hours!</Typography>
                    </Box>
                  </Grid>


<Grid size={{ xs: 12, sm: 12, md: 4, lg: 4   }}>
                    <Box sx={{textAlign: 'center'}}>
                        <svg role="presentation" fill="none" focusable="false" stroke-width="1.5" width="24" height="24" class="hidden sm:block icon icon-picto-timer" viewBox="0 0 24 24">
        <path d="M12 22.488A8.874 8.874 0 1 0 12 4.74a8.874 8.874 0 0 0 0 17.748v0Z" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M1.512 4.74a14.021 14.021 0 0 1 4.034-3.228M22.488 4.74a14.021 14.021 0 0 0-4.033-3.228M12 8.774v4.837h4.034" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <Typography variant='h3' sx={{fontSize: '20px', fontWeight: '600', my: 3}}>Next Day Delivery

</Typography>
      <Typography variant='body1'>Quick next-day delivery option available!

</Typography>
                    </Box>
                  </Grid>





<Grid size={{ xs: 12, sm: 12, md: 4, lg: 4  }}>
                    <Box sx={{textAlign: 'center'}}>
                        <svg role="presentation" fill="none" focusable="false" stroke-width="1.5" width="24" height="24" class="hidden sm:block icon icon-picto-credit-card" viewBox="0 0 24 24">
        <path d="M1.714 16.882c0 1.36 1.063 2.48 2.4 2.71 1.773.307 3.456.714 7.886.714s6.113-.407 7.886-.713c1.337-.232 2.4-1.351 2.4-2.709V6.708c0-1.183-.806-2.203-1.975-2.39A53.325 53.325 0 0 0 12 3.694c-4.43 0-6.114.407-7.887.713-1.337.232-2.4 1.351-2.4 2.709v9.766Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M22.286 9.588H1.714V7.02c0-1.305 1.02-2.378 2.306-2.597.235-.04.466-.08.703-.124 1.584-.288 3.351-.605 7.277-.605 3.69 0 6.617.352 8.39.638 1.12.182 1.896 1.162 1.896 2.297v2.959Z" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M14.666 15.804h3.485" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <Typography variant='h3' sx={{fontSize: '20px', fontWeight: '600', my: 3}}>Secure payment

</Typography>
      <Typography variant='body1'>Ultimate secure transactions guaranteed!

</Typography>
                    </Box>
                  </Grid>
                  </Grid>
            </Container>
        </Box>
    </>
  )
}

export default OrderProcessingSection