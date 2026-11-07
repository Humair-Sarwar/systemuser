import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const LoaderSpinner = () => {
  return (
    <Box sx={{width: '100%', textAlign: 'center'}}>
      <CircularProgress color="secondary" />
    </Box>
  )
}

export default LoaderSpinner
