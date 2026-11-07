import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Grid, Typography } from '@mui/material';

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
      {value === index && <Box sx={{ pt: 3, pb: 1 }}>{children}</Box>}
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

export default function CustomerOrderTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" textColor='secondary' indicatorColor="secondary">
          <Tab label="Buy Orders" {...a11yProps(0)} sx={{fontWeight: '600', textTransform: 'capitalize'}}/>
          {/* <Tab label="Sell Orders" {...a11yProps(1)} sx={{fontWeight: '600', textTransform: 'capitalize'}} />
          <Tab label="Repair Orders" {...a11yProps(2)} sx={{fontWeight: '600', textTransform: 'capitalize'}} /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <Box sx={{boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",backgroundColor: 'white', borderRadius: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 2}}><Typography sx={{fontWeight: '600', fontSize: '18px'}}>2</Typography>
            <Typography sx={{fontWeight: '500', fontSize: '12px', color: '#8d8d8dff'}}>All</Typography></Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <Box sx={{boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",backgroundColor: 'white', borderRadius: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 2}}><Typography sx={{fontWeight: '600', fontSize: '18px'}}>0</Typography>
            <Typography sx={{fontWeight: '500', fontSize: '12px', color: '#8d8d8dff'}}>Pending</Typography></Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <Box sx={{boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",backgroundColor: 'white', borderRadius: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 2}}><Typography sx={{fontWeight: '600', fontSize: '18px'}}>12</Typography>
            <Typography sx={{fontWeight: '500', fontSize: '12px', color: '#8d8d8dff'}}>In Progress</Typography></Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <Box sx={{boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",backgroundColor: 'white', borderRadius: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 2}}><Typography sx={{fontWeight: '600', fontSize: '18px'}}>0</Typography>
            <Typography sx={{fontWeight: '500', fontSize: '12px', color: '#8d8d8dff'}}>Completed</Typography></Box>
          </Grid>
          </Grid>
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel> */}
    </Box>
  );
}
