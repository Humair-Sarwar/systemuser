import { Box } from '@mui/system'
import React from 'react'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link } from 'react-router-dom';

export default function WhatsAppButton() {
  return (
    <>
        <Box className='whatsAppFixedFloatButton'>
            <Link target='_blank' to={'https://api.whatsapp.com/send?phone=923088340373&text=I%20want%20to%20trade%20in%20my%20tech%20device%20for%20cash'}>
              <Box sx={{backgroundColor: '#f5f7f9', padding: '8px 12px', fontSize: '11px', borderRadius: '5px', mr: 2}}>Need Help? Contact Us</Box>
                <Box sx={{borderRadius: '50%', backgroundColor: '#2db742'}} className='logoBtnWhatsApp'><WhatsAppIcon sx={{fontSize: '33px'}}/></Box>
            </Link>
        </Box>
    </>
  )
}
