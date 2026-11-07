import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router";
import categories from "../categories.json";
import { useEffect } from "react";
import { useState } from "react";









import { Accordion, AccordionDetails, AccordionSummary,  Slider } from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomizedSwitches from "./switchButton";





function valuetext(value) {
  return `${value}`;
}



export default function ResponsiveFilterSelect() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };



   const [value1, setValue1] = React.useState([0, 100]);
  
    const handleChange1 = (event, newValue, activeThumb) => {
      if (activeThumb === 0) {
        setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
      } else {
        setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
      }
    };
  

  
  const DrawerList = (
    <Box sx={{ width: 270 }} role="presentation">
    


 <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 3, pt: 1}}>  <Typography sx={{display: 'flex', alignItems: 'center'}}><svg role="presentation" fill="none" focusable="false" stroke-width="2" width="20" height="14" class="icon-subdued icon icon-filter" viewBox="0 0 20 14">
        <path d="M1 2C0.447715 2 0 2.44772 0 3C0 3.55228 0.447715 4 1 4V2ZM1 4H5V2H1V4Z" fill="currentColor"></path>
        <path d="M1 10C0.447715 10 0 10.4477 0 11C0 11.5523 0.447715 12 1 12V10ZM1 12H11V10H1V12Z" fill="currentColor"></path>
        <path d="M10 2H9V4H10V2ZM19 4C19.5523 4 20 3.55228 20 3C20 2.44772 19.5523 2 19 2V4ZM10 4H19V2H10V4Z" fill="currentColor"></path>
        <path d="M16 10H15V12H16V10ZM19 12C19.5523 12 20 11.5523 20 11C20 10.4477 19.5523 10 19 10V12ZM16 12H19V10H16V12Z" fill="currentColor"></path>
        <circle cx="7" cy="3" r="2" stroke="currentColor"></circle>
        <circle cx="13" cy="11" r="2" stroke="currentColor"></circle>
      </svg> <Box sx={{ml: 1}}>Filters</Box></Typography>
            <Box sx={{cursor: 'pointer'}} onClick={toggleDrawer(false)}>  <svg
          role="presentation"
          stroke-width="2"
          focusable="false"
          width="19"
          height="19"
          class="icon icon-close"
          viewBox="0 0 24 24"
        >
          <path
            d="M17.658 6.343 6.344 17.657M17.658 17.657 6.344 6.343"
            stroke="currentColor"
          ></path>
        </svg></Box>

        
        </Box>



  <Box className=''>
        
      <Box className='switch-filter-r-style-set-l' sx={{py: 2, borderTop: '1px solid rgb(26 26 26 / 12%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><Typography sx={{fontWeight: '600'}}>In stock only</Typography><CustomizedSwitches/></Box>








    <Box>
 <div className='left-slt-filters-target'>







<Accordion className='accordion-expand-left-filter-target' sx={{backgroundColor: 'transparent', boxShadow: 'none', borderTop: '1px solid rgb(26 26 26 / 12%)', borderRadius: '0 !important'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="product-condition-filter"
          sx={{px: 0, py: 1}}
        >
          <Typography sx={{fontWeight: '600'}}>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{p: 0, pb: 2}}>
      



<Accordion className='accordion-expand-left-filter-target' sx={{backgroundColor: 'transparent', boxShadow: 'none', borderTop: '1px solid rgb(26 26 26 / 12%)', borderRadius: '0 !important', ml: 1}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="product-condition-filter"
          sx={{px: 0, py: 1}}
        >
           <Link to={'/'}><Typography sx={{fontWeight: '600', color: 'black'}}>Mobile & Computing</Typography></Link>
        </AccordionSummary>
        <AccordionDetails sx={{p: 0, pb: 2}}>
      


<Accordion className='accordion-expand-left-filter-target' sx={{backgroundColor: 'transparent', boxShadow: 'none', borderTop: '1px solid rgb(26 26 26 / 12%)', borderRadius: '0 !important', ml: 1}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="product-condition-filter"
          sx={{px: 0, py: 1}}
        >
          <Link to={'/'}><Typography sx={{fontWeight: '600', color: 'black'}}>Smartphones</Typography></Link>
        </AccordionSummary>
        <AccordionDetails sx={{p: 0, pb: 2}}>
      
<Accordion className='accordion-expand-left-filter-target' sx={{backgroundColor: 'transparent', boxShadow: 'none', borderTop: '1px solid rgb(26 26 26 / 12%)', borderRadius: '0 !important', ml: 1}}>
        <AccordionSummary
          aria-controls="panel1-content"
          id="product-condition-filter"
          sx={{px: 0, py: 1}}
        >
          <Link to={'/'}><Typography sx={{fontWeight: '600', color: 'black'}}>Apple iPhones</Typography></Link>
        </AccordionSummary>
        <AccordionDetails sx={{p: 0, pb: 2}}>
      



        </AccordionDetails>
      </Accordion>


        </AccordionDetails>
      </Accordion>




        </AccordionDetails>
      </Accordion>





        </AccordionDetails>
      </Accordion>









      <Accordion className='accordion-expand-left-filter-target' sx={{backgroundColor: 'transparent', boxShadow: 'none', borderTop: '1px solid rgb(26 26 26 / 12%)', borderRadius: '0 !important'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="price-filter"
          sx={{px: 0, py: 1}}
        >
          <Typography sx={{fontWeight: '600'}}>Price</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{p: 0, pb: 2}}>
           <Box sx={{ width: '100%', px: 1 }}>
      <Slider
        getAriaLabel={() => 'Minimum distance'}
        value={value1}
        onChange={handleChange1}
        getAriaValueText={valuetext}
        disableSwap
      />
    </Box>
    <Box sx={{mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>

      
      <Box sx={{position: 'relative'}} className='range-inputs-target-set'><input type="number" className='range-input-target'/><Typography className='currency-target'>£</Typography></Box>

      <Typography>to</Typography>

            <Box sx={{position: 'relative'}} className='range-inputs-target-set'><input type="number" className='range-input-target'/><Typography className='currency-target'>£</Typography></Box>

    </Box>
        </AccordionDetails>
      </Accordion>
    <Accordion className='accordion-expand-left-filter-target' sx={{backgroundColor: 'transparent', boxShadow: 'none', borderTop: '1px solid rgb(26 26 26 / 12%)', borderRadius: '0 !important'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="brands-filter"
          sx={{px: 0, py: 1}}
        >
          <Typography sx={{fontWeight: '600'}}>Brand</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{p: 0, pb: 2}}>
      




<Box className='custom-check-box-style-set'>

  <div class="checkbox-container"><input id="" class="checkbox" type="checkbox" name="filter.p.m.custom.brand" value="Apple"/><label for="checkbox-template--15569882415178__main--sidebar-filter-p-m-custom-brand-apple">Apple (38)</label></div>

</Box>
<Box className='custom-check-box-style-set'>

  <div class="checkbox-container"><input id="" class="checkbox" type="checkbox" name="filter.p.m.custom.brand" value="Apple"/><label for="checkbox-template--15569882415178__main--sidebar-filter-p-m-custom-brand-apple">Apple (38)</label></div>

</Box>
<Box className='custom-check-box-style-set'>

  <div class="checkbox-container"><input id="" class="checkbox" type="checkbox" name="filter.p.m.custom.brand" value="Apple"/><label for="checkbox-template--15569882415178__main--sidebar-filter-p-m-custom-brand-apple">Apple (38)</label></div>

</Box>
<Box className='custom-check-box-style-set'>

  <div class="checkbox-container"><input id="" class="checkbox" type="checkbox" name="filter.p.m.custom.brand" value="Apple"/><label for="checkbox-template--15569882415178__main--sidebar-filter-p-m-custom-brand-apple">Apple (38)</label></div>

</Box>
<Box className='custom-check-box-style-set'>

  <div class="checkbox-container"><input id="checkbox-template--15569882415178__main--sidebar-filter-p-m-custom-brand-apple" class="checkbox" type="checkbox" name="filter.p.m.custom.brand" value="Apple"/><label for="checkbox-template--15569882415178__main--sidebar-filter-p-m-custom-brand-apple">Apple (38)</label></div>

</Box>






        </AccordionDetails>
      </Accordion>



       <Accordion className='accordion-expand-left-filter-target' sx={{backgroundColor: 'transparent', boxShadow: 'none', borderTop: '1px solid rgb(26 26 26 / 12%)', borderRadius: '0 !important'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="product-condition-filter"
          sx={{px: 0, py: 1}}
        >
          <Typography sx={{fontWeight: '600'}}>Condition</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{p: 0, pb: 2}}>
      




<Box className='custom-check-box-style-set'>

  <div class="checkbox-container"><input id="new" class="checkbox" type="checkbox" name="filter.p.m.custom.brand" value="New"/><label for="new">New (38)</label></div>

</Box>
<Box className='custom-check-box-style-set'>

  <div class="checkbox-container"><input id="refurbished" class="checkbox" type="checkbox" name="filter.p.m.custom.brand" value="Refurbished"/><label for="refurbished">Refurbished (38)</label></div>

</Box>
<Box className='custom-check-box-style-set'>

  <div class="checkbox-container"><input id="used" class="checkbox" type="checkbox" name="filter.p.m.custom.brand" value="Used"/><label for="used">Used (38)</label></div>

</Box>







        </AccordionDetails>
      </Accordion>





       <Accordion className='accordion-expand-left-filter-target' sx={{backgroundColor: 'transparent', boxShadow: 'none', borderTop: '1px solid rgb(26 26 26 / 12%)', borderRadius: '0 !important'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="product-condition-filter"
          sx={{px: 0, py: 1}}
        >
          <Typography sx={{fontWeight: '600'}}>Stock Filters</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{p: 0, pb: 2}}>
      




<Box className='custom-check-box-style-set'>

  <div class="checkbox-container"><input id="new" class="checkbox" type="checkbox" name="filter.p.m.custom.brand" value="New"/><label for="new">On Sale (38)</label></div>

</Box>
<Box className='custom-check-box-style-set'>

  <div class="checkbox-container"><input id="refurbished" class="checkbox" type="checkbox" name="filter.p.m.custom.brand" value="Refurbished"/><label for="refurbished">Featured (38)</label></div>

</Box>








        </AccordionDetails>
      </Accordion>
     
    </div>

        </Box>






        </Box>


    
      

       
    </Box>
  );

  return (
    <>
      

      <Button className="custom-primary-btn filter-sort-target-btn-res"  onClick={toggleDrawer(true)} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 1}}>
        <svg role="presentation" fill="none" focusable="false" stroke-width="2" width="18" height="18" class="icon icon-filter" viewBox="0 0 20 14">
        <path d="M1 2C0.447715 2 0 2.44772 0 3C0 3.55228 0.447715 4 1 4V2ZM1 4H5V2H1V4Z" fill="currentColor"></path>
        <path d="M1 10C0.447715 10 0 10.4477 0 11C0 11.5523 0.447715 12 1 12V10ZM1 12H11V10H1V12Z" fill="currentColor"></path>
        <path d="M10 2H9V4H10V2ZM19 4C19.5523 4 20 3.55228 20 3C20 2.44772 19.5523 2 19 2V4ZM10 4H19V2H10V4Z" fill="currentColor"></path>
        <path d="M16 10H15V12H16V10ZM19 12C19.5523 12 20 11.5523 20 11C20 10.4477 19.5523 10 19 10V12ZM16 12H19V10H16V12Z" fill="currentColor"></path>
        <circle cx="7" cy="3" r="2" stroke="currentColor"></circle>
        <circle cx="13" cy="11" r="2" stroke="currentColor"></circle>
      </svg></Box> Filter and sort</Button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        className='responsive-filter-menu-list-style'
      >
        {DrawerList}
      </Drawer>
    </>
  );
}
