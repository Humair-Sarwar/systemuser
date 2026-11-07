


















import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';
import { Box, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router';

const HeroBannerSlider = () => {
  const navigation = useNavigate();

    return (
        <Container sx={{maxWidth: '1450px !important'}}>
            <Box sx={{  mx: 'auto', borderRadius: '15px', overflow: 'hidden' }} className='hero-banner-slider-box'>
            <Swiper
                modules={[EffectFade, Autoplay, Pagination]}
                effect="fade"
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                speed={1000}
                pagination={{ clickable: true }}
            >
                    <SwiperSlide onClick={()=> navigation('/')} className='link-banner-set'>
                        <Paper
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            elevation={3}
                        >
<video playsinline="true" className='hero-banner-vid-row-style' autoPlay preload="metadata" muted="muted" loop="loop" poster="//eclattech.co.uk/cdn/shop/files/preview_images/a83f217c88a44df6a1ce91b7ccfc34c2.thumbnail.0000000000_800x.jpg?v=1712610189"><source src="//eclattech.co.uk/cdn/shop/videos/c/vp/a83f217c88a44df6a1ce91b7ccfc34c2/a83f217c88a44df6a1ce91b7ccfc34c2.HD-720p-1.6Mbps-26911229.mp4?v=0" type="video/mp4"/><img src="//eclattech.co.uk/cdn/shop/files/preview_images/a83f217c88a44df6a1ce91b7ccfc34c2.thumbnail.0000000000_800x.jpg?v=1712610189"  /></video>


                        </Paper>
                    </SwiperSlide>
                    <SwiperSlide onClick={()=> navigation('/')} className='link-banner-set'>
                        <Paper
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            elevation={3}
                            
                        >
<video playsinline="true" className='hero-banner-vid-row-style' autoPlay preload="metadata" muted="muted" loop="loop" poster="//eclattech.co.uk/cdn/shop/files/preview_images/3a58e8c868374c718d96327ffae5a3e5.thumbnail.0000000000_800x.jpg?v=1731263885"><source src="//eclattech.co.uk/cdn/shop/videos/c/vp/3a58e8c868374c718d96327ffae5a3e5/3a58e8c868374c718d96327ffae5a3e5.HD-720p-2.1Mbps-37893225.mp4?v=0" type="video/mp4"/><img src="//eclattech.co.uk/cdn/shop/files/preview_images/3a58e8c868374c718d96327ffae5a3e5.thumbnail.0000000000_800x.jpg?v=1731263885" /></video>
 </Paper>             </SwiperSlide>

   <SwiperSlide onClick={()=> navigation('/')} className='link-banner-set'>
                        <Paper
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            elevation={3}
                        >

<img className='hero-banner-vid-row-style' src="//eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=2800" alt="" srcset="//eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=200 200w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=300 300w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=400 400w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=500 500w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=600 600w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=700 700w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=800 800w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=900 900w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=1000 1000w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=1200 1200w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=1400 1400w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=1600 1600w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=1800 1800w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=2000 2000w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=2200 2200w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=2400 2400w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=2600 2600w, //eclattech.co.uk/cdn/shop/files/iPhone-16-Banner-Eclat-UK.png?v=1731500319&amp;width=2800 2800w" width="2800" height="1000" loading="eager" fetchpriority="low" sizes="min(1600px, 100vw)" ></img>


 </Paper>             </SwiperSlide>









 <SwiperSlide onClick={()=> navigation('/')} className='link-banner-set'>
                        <Paper
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            elevation={3}
                        >

<img className='hero-banner-vid-row-style' src="//eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=2800" alt="" srcset="//eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=200 200w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=300 300w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=400 400w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=500 500w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=600 600w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=700 700w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=800 800w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=900 900w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=1000 1000w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=1200 1200w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=1400 1400w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=1600 1600w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=1800 1800w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=2000 2000w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=2200 2200w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=2400 2400w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=2600 2600w, //eclattech.co.uk/cdn/shop/files/Eclat-UK-Appliances-Hero-Section-Image.png?v=1724860738&amp;width=2800 2800w" width="2800" height="1000" loading="eager" fetchpriority="low" sizes="min(1600px, 100vw)"></img>

 </Paper>             </SwiperSlide>









  <SwiperSlide onClick={()=> navigation('/')} className='link-banner-set'>
                        <Paper
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            elevation={3}
                        >

<img className='hero-banner-vid-row-style' src="//eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=2800" alt="" srcset="//eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=200 200w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=300 300w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=400 400w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=500 500w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=600 600w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=700 700w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=800 800w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=900 900w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=1000 1000w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=1200 1200w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=1400 1400w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=1600 1600w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=1800 1800w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=2000 2000w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=2200 2200w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=2400 2400w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=2600 2600w, //eclattech.co.uk/cdn/shop/files/Trade-in_Banner_Eclat_UK_1.png?v=1715972832&amp;width=2800 2800w" width="2800" height="1000" loading="eager" fetchpriority="low" sizes="min(1600px, 100vw)"></img>
 </Paper>             </SwiperSlide>










             
            </Swiper>
        </Box>
        </Container>
    );
};

export default HeroBannerSlider;

