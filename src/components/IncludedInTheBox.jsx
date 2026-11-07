import React from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'

const IncludedInTheBox = () => {
  return (
    <>
         <Box sx={{backgroundColor: "#f0f0f0", py: 5}}>
            <Container sx={{maxWidth: '1470px !important'}}>
                <Typography variant='h2' sx={{textAlign: 'center', mb: 5, fontSize: {xs: '25px', sm: '25px', md: '30px', lg: '32px'}, fontWeight: '600'}}>Included In The Box</Typography>
                <Grid container spacing={4}>
                  <Grid size={{xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <Box sx={{textAlign: 'center'}}>
                           <img src="/Smartphone-icon-clat-tech.png" alt="" className='include-box-image-get-target-style'/>
      <Typography variant='h3' sx={{fontSize: '20px', fontWeight: '600', my: 3}}>iPhone 16 Pro Max

</Typography>
                    </Box>
                  </Grid>


<Grid size={{ xs: 12, sm: 12, md: 4, lg: 4   }}>
                    <Box sx={{textAlign: 'center'}}>
                        <img src="/Charging-Cable-Icon-Eclat-Tech-UK.png" alt="" className='include-box-image-get-target-style'/>
      <Typography variant='h3' sx={{fontSize: '20px', fontWeight: '600', my: 3}}>USB-C Charging Cable



</Typography>
                    </Box>
                  </Grid>





<Grid size={{ xs: 12, sm: 12, md: 4, lg: 4  }}>
                    <Box sx={{textAlign: 'center'}}>
                        <img src="/User-Manual-Eclat-Tech.png" alt="" className='include-box-image-get-target-style'/>
      <Typography variant='h3' sx={{fontSize: '20px', fontWeight: '600', my: 3}}>Documentation & Stickers



</Typography>
                    </Box>
                  </Grid>



















                  
                  </Grid>
            </Container>
        </Box>
    </>
  )
}

export default IncludedInTheBox