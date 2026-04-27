import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


import { Header } from "../../components/header";
import { OrderTable } from "../../components/Tables/OrderTableWithSelect";
import { OrderDetailsModal } from "../../components/OrderDetailsModal";
import { ReviewDrawer } from "../../components/ReviewDrawer";

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


import PersonImg from '../../assets/images/download-Photoroom.png-Photoroom2.png'
import './PersonalAccount.css'


export const PesonalAccount = () => {
    const [isLoading, setLoading] = React.useState(false);
    const [userData, setUserData] = useState(null);
    const [isOrderLoading, setIsOrderLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [errors, setErrors] = useState();
    const [snackBarMessahe, setSnackBarMessahe] = useState()
    const [selectOrderId, setSelectOrderId] = React.useState([])
    const [orderDetail, setorderDetail] = React.useState()
    const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = React.useState(false)
    const [isReviewDrawerOpen, setIsReviewDrawerOpen] = React.useState(false)
    const [open, setOpen] = React.useState(false);

    // const handleClick = () => {
    //   setOpen(true);
    // };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    const GetAllOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:4444/Orders/getAllOrders/${userData?.ID}`, {
                headers: {
                    authorization: `Bearer ${userData.Token}`
                }
                
              });
          
              if(response.data.success && response.data.data) {
                const ordersWithId = Object.values(response.data)
                .filter(item => typeof item === 'object')
                .map((order, index) => ({ ...order, id: index + 1 }));
              setOrders(ordersWithId);
                setOrders(ordersArray);
                console.log(ordersArray)
                console.log(rows)
              } else {
                setOrders([]);
              }
              setIsOrderLoading(false);
        } catch (error) {
          setErrors( error.response.data.message);
        }
        finally {
          setIsOrderLoading(false); // Set loading to false after data is fetched
        }
      };

      const CancelOrdersByUser = async (event) => {
        try {
          event.preventDefault();
            const response = await axios.post(`http://localhost:4444/Orders/CancelOrder`, {
              "OrderID": "[ "+selectOrderId+" ]"
            }, {
                headers: {
                    authorization: `Bearer ${userData.Token}`
                }
                
              });
              if(response.data.success) {
                setSnackBarMessahe(response.data.message);
                setOpen(true);
                await GetAllOrders(); 
              } 
              
        } catch (error) {
          setSnackBarMessahe(error.response.data.error);
          setOpen(true);
        }
        finally {
        }
      };


      const GetOrderDetailById = async (event) => {
        try {
          event.preventDefault();
            const response = await axios.get(`http://localhost:4444/Orders/getOneOrderDetail/${selectOrderId[0]}`, {
                headers: {
                    authorization: `Bearer ${userData.Token}`
                }
                
              });
              if(response.data.success) {
                setorderDetail(response.data[0][0])
                console.log(response.data[0][0])

              } 
              
        } catch (error) {
          setSnackBarMessahe(error.response.data.error);
          setOpen(true);
        }
        finally {
        }
      };


    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      }, []);

    useEffect(() => {
      if (userData?.Token) {
        GetAllOrders();
      }
    }, [userData?.Token]);

      const navigate = useNavigate();
      
      const handleLogout = () => {
          // Очистка localStorage
        localStorage.clear();
        navigate('/');
        
        };
        
        const handleGetOrderDetail = async(event) =>{
          if(selectOrderId.length ==1){
            GetOrderDetailById(event)
            setIsOrderDetailsModalOpen(true);

            // const url = 'GET https://api.worldnewsapi.com/search-news?source-countries=de&entities=LOC:Italy';
            // const apiKey = '88af7b2307414d49998fdab22654e991';
            // const response = await axios.get(`https://api.worldnewsapi.com/search-news?source-countries=de&entities=LOC:Italy`, {
            //   headers: {
            //       'x-api-key': apiKey
            //   }
            // })
            // .then(response => {
            //     if (!response.ok) {
            //         throw new Error(`HTTP error! Status: ${response.status}`);
            //     }
            //     return response.json();
            // })
            // .then(data => console.log(data))
            // .catch(error => console.error('There was a problem with the fetch operation:', error));


const options = {
  method: 'GET',
  url: 'https://cars-by-api-ninjas.p.rapidapi.com/v1/cars',
  params: {model: 'corolla'},
  headers: {
    'x-rapidapi-key': '9cce1136bbmshb5975d9e06f3ec2p14ff77jsn2823add3950d',
    'x-rapidapi-host': 'cars-by-api-ninjas.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}
          }
        } 

        const handleCancelOrders = (event) =>{
          if(selectOrderId.length > 0)
            CancelOrdersByUser(event)
        } 

        
        const handleAddReview = (event) =>{
          if(selectOrderId.length == 1){
            setIsReviewDrawerOpen(true)
          }
        } 
        const action = (
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
              ПОНЯТНО
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        );

  return (
    <>
    <Header/>
    
    <div className='Content3'>
    {errors? 
                <Alert variant="filled" severity="error" >
                {errors}
              </Alert> : (<div>
          <div className='PersonalInformationConteiner'>
             <div className='PersonImgConteiner'>
                <img src={PersonImg} alt="" />
            </div>
            <div>
           <OrderDetailsModal dataset={orderDetail} open={isOrderDetailsModalOpen} setOpen={setIsOrderDetailsModalOpen}/>
           <ReviewDrawer 
           token={userData?.Token}
           selectOrderId={selectOrderId} 
           open={isReviewDrawerOpen} 
           setMessageOpen={setOpen}
           setSnackBarMessahe={setSnackBarMessahe}
           setOpen={setIsReviewDrawerOpen}/>

             {isLoading ? (
                    <List sx={{fontFamily: '"Roboto", sans-serif'}} aria-label="mailbox folders">
            <ListItem>
                <Skeleton animation="wave" sx={{ width: 300 }}/>
            </ListItem>
            <Divider component="li" />
            <ListItem>
                <Skeleton animation="wave" sx={{ width: 300 }}/>
            </ListItem>
            <Divider component="li" />
            <ListItem>
                <Skeleton animation="wave" sx={{ width: 300 }}/>
            </ListItem>
            <Divider component="li" />
            <ListItem>
                <Skeleton animation="wave" sx={{ width: 300 }}/>
            </ListItem>
            </List>
            ):(
                <List sx={{fontFamily: '"Roboto", sans-serif'}} aria-label="mailbox folders">
                <ListItem>
                    <ListItemText primary="ФИО:&nbsp; " /> {userData?.Full_name}
                </ListItem>
                <Divider component="li" />
                <ListItem>
                    <ListItemText primary="Дата рождения: &nbsp;" /> {new Date(userData?.Data_birtday).toLocaleDateString('ru-RU')}
                </ListItem>
                <Divider component="li" />
                <ListItem>
                    <ListItemText primary="Номер телефона: &nbsp; " /> {userData?.Telephone.trim()}
                </ListItem>
                <Divider component="li" />
                <ListItem>
                    <ListItemText primary="E-mail: &nbsp;" /> {userData?.Email}
                </ListItem>
                </List>
            )}
            <Button sx={{ bgcolor: '#fdc501', mb:'20px', mt: '20px', width: '200px' }}
            disabled={false}
            size="large" 
            variant="contained"
            onClick={handleLogout}
            >
            Выйти
        </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackBarMessahe}
        action={action}
      />
            </div>
        </div>
        <div>
            <div className='Order-tableBtn'>
            
            <Grid container spacing={2}>
                <Grid item xs={2}>
                <Button 
                sx={{ bgcolor: '#fdc501', mb:'20px', mt: '20px', width: '200px' }} 
                disabled={selectOrderId.length>0? false : true} 
                size="large"
                variant="contained"
                onClick={handleCancelOrders} >
                    Отменить заказ
                </Button>
                </Grid>
                <Grid item xs={3}>
                <Button 
                sx={{ bgcolor: '#fdc501', mb:'20px', mt: '20px', width: '200px', ml: '40px' }}
                disabled={selectOrderId.length==1 ? false : true} 
                size="large" 
                variant="contained"
                onClick={handleAddReview}>
                    Оставить отзыв
                </Button>
                </Grid>
                <Grid item xs={2}>
                <Button 
                sx={{ bgcolor: '#fdc501', mb:'20px', mt: '20px', width: '300px', ml: '40px' }} 
                disabled={selectOrderId.length==1 ? false : true} 
                size="large" 
                variant="contained"
                onClick={handleGetOrderDetail} >
                    Посмотреть данные заказа
                </Button>
                
                </Grid>
                {isOrderLoading ? (
                <Box sx={{ bgcolor: '#f3f3f3', display: 'flex', height: '400px', width: '80%', alignItems: 'center',   textAlign: 'center', paddingLeft: '47%'}} >
                  <CircularProgress color="secondary" cx={{alignItems: 'center',   textAlign: 'center'}} />
                </Box>
              ) : (
                orders.length === 0 ? (
                  <Typography variant="h6" component="div" sx={{ mt: 20, minWidth: 1000, ml: 'auto' }}>
                    Заказов нет
                  </Typography>
                ) : (
                  <OrderTable dataset={orders} selectOrderId={selectOrderId} setSelectOrderId={setSelectOrderId} />
                )
              )}
                
        </Grid>
        
            </div>
        </div>
        </div>
              )}
    </div>
    </>
)};
