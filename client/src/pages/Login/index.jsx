// import React from "react";
// import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import backGroundImg from '../../assets/images/Rectangle-4.jpeg'
import CompanyLogo from '../../assets/images/Company_logo.png'


import * as React from 'react';
import axios from 'axios';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { useLocation, useSearchParams, Link, useNavigate  } from 'react-router-dom';


import './Auth.css';
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
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
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


export const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [login, setLogin] = React.useState ('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [telephone, setTelephone] = React.useState('');
  const [birthday, setBirthday] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);


  const [loginError, setLoginError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [fullNameError, setFullNameError] = React.useState('');
  const [telephoneError, setTelephoneError] = React.useState('');
  const [BirthdayError, setBirthdayError] = React.useState('');

  const navigate = useNavigate();

  // Определяем начальное состояние в зависимости от режима
  const initialValue = mode === 'registration' ? 1 : 0;
  const [value, setValue] = React.useState(initialValue);
 


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLoginChange = (event) => {
    setLogin(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleTelephoneChange = (event) => {
    setTelephone(event.target.value);
  };

  const handleBirthdayChange = (event) => {
    setBirthday(event.target.value);
  };
  

  //отправка данных регистрации на сервер
  const handleRegistrationSubmit = async (event) =>{
    event.preventDefault();
    setLoginError('');
    setPasswordError(''); 
    setFullNameError(''); 
    setTelephoneError(''); 
    setBirthdayError(''); 

    try {
      const data = {
        email: login,
        phone: telephone,
        password,
        fullName,
      };
  
      if (birthday) {
        data.birthday = birthday;
      }
  
      // Отправляем POST запрос
      const response = await axios.post('http://localhost:4444/auth/register', data);
      if(response.data.success){
        const loginData = {
          phone: telephone,
          password,
        };
        const response = await axios.post('http://localhost:4444/auth/login', loginData);

        const userData = {
          Token: response.data.token,
          ID: response.data.userData.ID,
          Full_name: response.data.userData.Full_name,
          Telephone: response.data.userData.Telephone,
          Email: response.data.userData.Email,
          Data_birtday: response.data.userData.Data_birtday
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        navigate('/PersonalAccount');
      }      
      // Здесь вы можете обработать ответ от сервера
    } catch (error) {
      if (error.response.data?.message === 'Неверный email или пароль') {
        setLoginError('Неверный email или пароль');
        setPasswordError('Неверный email или пароль');
      } else if (error.response.data[0]?.type === 'field') {
        if (error.response.data[0].path === 'email') {
          setLoginError(error.response.data[0].msg);
        } else if (error.response.data[0].path === 'phone') {
          setTelephoneError(error.response.data[0].msg);
        } else if (error.response.data[0].path === 'password') {
          setPasswordError(error.response.data[0].msg);
        }
      }
    }
  }


//отправка данных авторизации на сервер
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginError('');
    setPasswordError('');
    let isEmail = false;
    if (login.includes('@'))
      isEmail=true
    
    const loginData = {
      password,
    };

    if (isEmail) {
      loginData.email = login;
    } else {
      loginData.phone = login;
    }
    try {
      const response = await axios.post('http://localhost:4444/auth/login', loginData);

      if(response.data.success){
        const userData = {
          Token: response.data.token,
          ID: response.data.userData.ID,
          Full_name: response.data.userData.Full_name,
          Telephone: response.data.userData.Telephone,
          Email: response.data.userData.Email,
          Data_birtday: response.data.userData.Data_birtday
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        navigate('/PersonalAccount');
      }      
    } catch (error) {
  
      if (error.response.data?.message === 'Неверный email или пароль') {
        setLoginError('Неверный email или пароль');
        setPasswordError('Неверный email или пароль');
      } else if (error.response.data[0]?.type === 'field') {
        if (error.response.data[0].path === 'email') {
          setLoginError(error.response.data[0].msg);
        } else if (error.response.data[0].path === 'phone') {
          setLoginError(error.response.data[0].msg);
        } else if (error.response.data[0].path === 'password') {
          setPasswordError(error.response.data[0].msg);
        }
      }
      // Здесь вы можете обработать ошибку
    }
    // Здесь вы можете выполнить дальнейшие действия, такие как отправка данных на сервер
  };

  return (
    <>
          <div className="background">
             <img src={backGroundImg} alt="back ground imgae" />
         </div>
         <Paper className='root' elevation={5}>

    <Box sx={{ width: '100%' , m:0}}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Авторизация" {...a11yProps(0)} />
          <Tab label="Регистрация" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
      <div className='logo1'>
        <img src={CompanyLogo} alt="Logo" />
        </div>
     <Typography className='title' variant="h5">
         Вход в аккаунт
       </Typography>
       <form onSubmit={handleSubmit}>
      <TextField
        className='field'
        label="E-Mail или Телефон"
        type="text"
        fullWidth
        error={loginError? true: false}
        helperText={loginError ? loginError: ''}
        value={login}
        required
        onChange={handleLoginChange}
      />
      <FormControl sx={{ mb:2, width: '100%' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            error={passwordError? true: false}
            helperText={passwordError ? passwordError: ''}
            onChange={handlePasswordChange}
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        {/* <Link to="/Orders/CreateOrder" > */}
      <Button sx={{ bgcolor: '#fdc501'}} type='submit' size="large" variant="contained" fullWidth>
        Войти
      </Button>
      {/* </Link> */}
     </form>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div>
      <div className='logo2'>
        <img src={CompanyLogo} alt="Logo" />
      </div>
      <Typography sx={{ ml:8, mt:-6}} className='title' variant="h5">
        Создание аккаунта
      </Typography>
      </div>
      <form onSubmit={handleRegistrationSubmit}>
      <TextField 
        type="fullName"
       required= 'укажите ФИО' 
       className='field' 
       label="ФИО" 
       fullWidth 
       error={fullNameError? true: false}
        helperText={fullNameError ? fullNameError: ''}
       value={fullName}
      onChange={handleFullNameChange}/>
      <TextField 
        type="email"
        required='укажите почту' 
        className='field' 
        label="E-Mail" 
        fullWidth 
        error={loginError? true: false}
        helperText={loginError ? loginError: ''}
        value={login}
        onChange={handleLoginChange}/>
        <TextField 
        type="telephone"
        required='укажите телефон'
        className='field'
        label="Телефон"
        fullWidth 
        error={telephoneError? true: false}
        helperText={telephoneError ? telephoneError: ''}
        value={telephone}
        onChange={handleTelephoneChange}/>
        <FormControl sx={{ mb:2, width: '100%' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Пароль*</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            error={passwordError? true: false}
            helperText={passwordError ? passwordError: ''}
            onChange={handlePasswordChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
      
      <TextField 
        type="date"
        className='field'
         fullWidth 
         value={birthday}
        error={BirthdayError? true: false}
        helperText={BirthdayError ? BirthdayError: ''}
        onChange={handleBirthdayChange}/>
      <Button sx={{ bgcolor: '#fdc501' }} disabled={false} type='submit' size="large" variant="contained" fullWidth>
        Зарегистрироваться
      </Button>
      </form>
      </CustomTabPanel>
      
    </Box>
    </Paper>

    </>
  );
}

