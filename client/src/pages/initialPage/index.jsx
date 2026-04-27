import backGroundImg from '../../assets/images/image-bg5.jpg'
import CompanyLogo from '../../assets/images/Company_logo.png'
import './InitialPage.css';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';




export const InitialPage = () => {
    const LoginButton = styled(Button)(({ theme }) => ({
        fontSize: 16,
        padding: '12px 40px',
        border: 'none',
        lineHeight: 1.5,
        borderColor: '#0063cc',
        backgroundColor: '#fdc501',
        '&:hover': {
          backgroundColor: '#fda101',
        },
      }));
      const RegistrationButton = styled(Button)(({ theme }) => ({
        fontSize: 18,
        fontcolor: 'white',
        padding: '12px 18px',
        border: '1px solid',
        lineHeight: 1.5,
        borderColor: '#fdc501',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: '#fdc501',
        },
      }));

  return (
    <div >
        <div className="background1">
            <img src={backGroundImg} alt="back ground imgae" />
        </div>
      <div className="overlay1"></div>
      <div className="content1">
        <div className='logo1'>
        <img src={CompanyLogo} alt="Logo" />
        </div>
    <h1>
        Наше приложение находит лучших водителей и маршруты.
    </h1>
    <h2>Быстрый и доступный способ ездить самому и возить грузы.</h2>
    <Stack spacing={2} direction="row">
    <Link to="/auth?mode=login">
        <LoginButton variant="contained">Войти</LoginButton>
    </Link>
    <Link to="/auth?mode=registration" >
      <RegistrationButton variant="contained">Зарегистрироваться</RegistrationButton>
    </Link>
    </Stack>
        </div> 
    </div>
)};
