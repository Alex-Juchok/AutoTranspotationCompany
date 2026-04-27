import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import './header.css'
import CompanyLogo from '../../assets/images/Company_logo.png'
import Checkout from '../../assets/images/images-removebg-preview.png'
import AnalysisIcon from '../../assets/images/png-transparent-computer-icons-data-analysis-business-business-trademark-people-logo-Photoroom.png-Photoroom.png'
import personalAccount from '../../assets/images/download-Photoroom.png-Photoroom.png'
import { Link } from 'react-router-dom';


export const Header = () => {
    

    return (
      <div className='root2'>
      {/* //<Container maxWidth="lg"> */}
        <div className='right-side'>
        
        <Stack direction="row" spacing={3}>
        <div className='logo2'>
        <img src={CompanyLogo} alt="Logo" />
        </div>
        
        <Link to="/Orders/CreateOrder" >
      <Button variant="outlined"  sx={{ color: 'white', border: '1px solid white'  }} endIcon={<div className='image-element'>
        <img src={Checkout} alt="Logo" />
        </div>}>
        Оформить заказ
      </Button>
      </Link>
      <Link to="/Orders/Analysis" >
      <Button variant="outlined"  sx={{ color: 'white', border: '1px solid white'  }} endIcon={<div className='image-element'>
        <img src={AnalysisIcon} alt="Logo" />
        </div>}>
        Анализировать заказы
      </Button>
      </Link>
      <Link to="/PersonalAccount" >
      <Button variant="outlined"  sx={{ color: 'white', border: '1px solid white'  }} endIcon={<div className='image-element'>
        <img src={personalAccount} alt="Logo" />
        </div>}>
        Личный кабинет
      </Button>
      </Link>
      </Stack>
        </div>
      {/* </Container> */}
    </div>
  )};
  