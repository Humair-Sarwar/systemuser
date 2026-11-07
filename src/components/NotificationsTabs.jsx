import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CommentIcon from '@mui/icons-material/Comment';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function NotificationsTabs({indx}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '300px', maxHeight: '400px' }} className='nt-indc-style-target'>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs textColor='secondary' indicatorColor="secondary"  value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab sx={{textTransform: 'capitalize', width: '50%'}} label="Unread (0)" {...a11yProps(0)} />
          <Tab sx={{textTransform: 'capitalize', width: '50%'}} label="Read (10)" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box sx={{display: 'flex', alignItems: 'center', cursor: 'pointer', py: 2, px: 2}} className='notification-msg-target'>
            <CommentIcon sx={{mr: 2}} color='secondary'/>
            <Box><Typography sx={{fontSize: '13px', fontWeight: '600'}}>Your order has been successfully completed.</Typography>
            <Typography sx={{fontSize: '12px'}}>02, Aug 2025 05:56 PM</Typography></Box>
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center', cursor: 'pointer', py: 2, px: 2}} className='notification-msg-target'>
            <CommentIcon sx={{mr: 2}} color='secondary'/>
            <Box><Typography sx={{fontSize: '13px', fontWeight: '600'}}>Your order has been successfully completed.</Typography>
            <Typography sx={{fontSize: '12px'}}>02, Aug 2025 05:56 PM</Typography></Box>
        </Box>

        
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Box sx={{display: 'flex', alignItems: 'center', cursor: 'pointer', py: 2, px: 2}} className='notification-msg-target'>
            <CommentIcon sx={{mr: 2}} color='secondary'/>
            <Box><Typography sx={{fontSize: '13px', fontWeight: '600'}}>Your order has been successfully completed.</Typography>
            <Typography sx={{fontSize: '12px'}}>02, Aug 2025 05:56 PM</Typography></Box>
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center', cursor: 'pointer', py: 2, px: 2}} className='notification-msg-target'>
            <CommentIcon sx={{mr: 2}} color='secondary'/>
            <Box><Typography sx={{fontSize: '13px', fontWeight: '600'}}>Your order has been successfully completed.</Typography>
            <Typography sx={{fontSize: '12px'}}>02, Aug 2025 05:56 PM</Typography></Box>
        </Box>
      </CustomTabPanel>
      
    </Box>
  );
}
