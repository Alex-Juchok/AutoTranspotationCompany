import * as React from 'react';


import { Header } from "../../components/header";
import MapComponent from '../../components/OpenStreetMap'
import { MenuItemWithImg } from '../../components/MenuItemWithImg'
import { AdditionalOrderDetails } from '../../components/AdditinalOrderDetails'

import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';

import TextField from "@mui/material/TextField";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';



import axios from 'axios';


import CashIcon from '../../assets/images/download-removebg-preview (5).png'
import BankCardIcon from '../../assets/images/download-removebg-preview (4).png'
import PassangerIcon from '../../assets/images/download-removebg-preview (6).png'
import CargoIcon from '../../assets/images/download-removebg-preview (7).png'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


import './orderPage.css'

export const OrderPage = () => {
  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { label: 'The Good, the Bad and the Ugly', year: 1966 },
    { label: 'Fight Club', year: 1999 },
    { label: 'Huinai' }
  ]
  
  // const usedAdresses = [
  //   {label: "eyer fdbg qwew, ул шельмана, 13, 65 "},
  //   {label: "vzqwqw nvcbs daswe, ул колотинина, 5 "},
  //   {label: "fsdfdggd trywr cbx, ул хуюшкина, 8 "},
  //   ]
   
    const [typeOfOrder, setTypeOfOrder] = React.useState(null);
    const [typeOfPayment, setTypeOfPayment] = React.useState(null);
    const [numberOfPassengers, setNumberOfPassengers] = React.useState(0);
    const [classOfService, setClassOfService] = React.useState(null);
    const [cargoWeight, setCargoWeight] = React.useState(null);
    const [dimensionsOfTheCargo, setDimensionsOfTheCargo] = React.useState(null);
    const [typeOfCargo, setTypeOfCargo] = React.useState(null);

    const [isButtonPressed, setIsButtonPressed] = React.useState(false);
    const [fields, setFields] = React.useState([{id:0, label: 'Началый адрес', address: '' }, {id:1, label: 'Конечный адрес', address: '' }]);
    const [isAddButton, setIsAddButton] = React.useState(true);
    const [isRemoveButton, setIsRemoveButton] = React.useState(false);
    const [nextId, setNextId] = React.useState(2);
    const [address, setAddressState] = React.useState('');
    const [usedAdresses, setUsedAdresses] = React.useState({label: 'tdf'});
    const [isOrderModal, setisOrderModal] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState('')
    const [isSnackBarOpen, setIsSnackBarOpen] = React.useState(false);


    const [userData, setUserData] = React.useState(null);
    const [orderMessage, setOrderMessage] = React.useState('');



  const addField = () => {
    if (fields.length < 10){
      setFields([...fields, { id: nextId, label: 'Промежуточный адрес', address: '' }]);
      setIsAddButton(true)
      setNextId(nextId + 1);
    } else setIsAddButton(false)
    if(fields.length+1 > 2){ 
      setIsRemoveButton(true)
    }
  };

  const removeField = () => {
    if (fields.length > 2){
      setFields(fields.slice(0, -1));
      setIsRemoveButton(true)
    }else setIsRemoveButton(false)
    if(fields.length+1 < 10){
      setIsAddButton(true)
    }
  }

  const setAddress = (address) => {
    const index = fields.findIndex(field => field.address === '');
    if (index !== -1) {
      const newFields = [...fields];
      newFields[index].address = address;
      setFields(newFields);
    }
  };

  const formatAddressesData = (fields) => {
    return fields.map(field => {
      const [addressPart, street, house, body] = field.address.split(', '); // Предполагаем, что адреса разделены запятыми
      return `[${addressPart}, ${street}, ${house}, ${body || 'null'}, ${field.id+1}]`;
    }).join(', ');
  };

    const handleTypeOfOrderSelection = (method) => {
      setTypeOfOrder(method);
    };

    const handleTypeOfPaymentSelection = (method) => {
      setTypeOfPayment(method);
    };

    const handleAddressChange = (id, value) => {
      const newFields = fields.map(field => field.id === id ? { ...field, address: value } : field);
      setFields(newFields);
    };

    React.useEffect(() => {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    }, []);

    React.useEffect(() => {
      if (userData) {
        GetUsedAddresses();
      }
    }, [userData]);

    const GetUsedAddresses = async (event) => {
      try {
          const response = await axios.get(`http://localhost:4444/GetUserAdresses/${userData?.ID}`, {
              headers: {
                  authorization: `Bearer ${userData?.Token}`
              }
              
            });
            if(response.data.success) {
              setUsedAdresses(response.data.addresses)
            } 
            
      } catch (error) {
        
      }
      finally {
      }
    };

    const CreateOrder = async (event) => {
      try {
          const data = {
            ClientID: userData?.ID,
            AddressesData: formatAddressesData(fields),
            Number_of_passengers: null,
            class_of_serviceID:null,
            Cargo_weight:null,
            Dimensions_of_the_cargo: null,
            Type_of_cargoID: null
          }
          
          if (typeOfPayment=='cash')
            data.Type_of_paymentID = 1
          else if(typeOfPayment=='card')
            data.Type_of_paymentID = 2
          else if(!typeOfPayment)  
            throw new Error('Невыбран тип оплаты');
          if (typeOfOrder=='passanger'){
            data.Types_of_orderID = 1
            if (numberOfPassengers < 1 || numberOfPassengers>10)
              throw new Error('Неверное количество пассажиров');
            else
              data.Number_of_passengers = Number(numberOfPassengers)
            if (classOfService=='economy')
              data.class_of_serviceID=1
            else if (classOfService=='comfort')
              data.class_of_serviceID=2
            else if (classOfService=='business')
              data.class_of_serviceID=3
            else if (classOfService=='elite')
              data.class_of_serviceID=4
            else if(!classOfService)  
              throw new Error('Невыбран класс обслуживания')
              
          }else if(typeOfOrder=='cargo'){
            data.Types_of_orderID = 2
            
            if (cargoWeight < 0.1 || cargoWeight>1000)
              throw new Error('Неверный вес груза');
            else
              data.Cargo_weight = Number(cargoWeight)
              data.Dimensions_of_the_cargo = dimensionsOfTheCargo
              data.Type_of_cargoID=typeOfCargo

          }else if(!typeOfOrder)   
            throw new Error('Невыбран тип заказа');
            console.log(data)
          const response = await axios.post(`http://localhost:4444/CreateOrder`, data, {
              headers: {
                  authorization: `Bearer ${userData?.Token}`
              }
              
            });
            if(response.data.success) {
              // setSnackBarMessahe(response.data.message);
              // setOpen(true);  
              setOrderMessage(response.data.message)
              setisOrderModal(true);
            } 
            
      } catch (error) {
        if (error.response && error.response.data) {
          if (!error.response.data.success) {
            setSnackBarMessage(error.response.data.message);
            setIsSnackBarOpen(true);
          } else {
            setSnackBarMessage(error.message);
            setIsSnackBarOpen(true);
          }
        } else {
          setSnackBarMessage(error.message);
          setIsSnackBarOpen(true);
        }
      }
      finally {
      }
    };


    const handleСheckout = (event) =>{
      CreateOrder(event);
      //console.log(fields)
      //console.log(typeOfOrder+" : "+ typeOfPayment+" : "+numberOfPassengers)
    }

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      bgcolor: '#b4e0b4',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };


    const action = (
      <React.Fragment>
        <Button color="secondary" size="small" onClick={() => {setIsSnackBarOpen(false)}}>
          ПОНЯТНО
        </Button>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => {setIsSnackBarOpen(false)}}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    );

  return (
    <>
    <Header/>
    <h1>Order Page</h1>
    <div className="content">
    <div className="mapPlace">
    <MapComponent 
    setAddress={setAddress}
    address={address}
    setAddressState={setAddressState}/>
    </div>
    <Modal
        open={isOrderModal}
        onClose={() => {setisOrderModal(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {orderMessage}
          </Typography>
          <Button onClick={() => {setisOrderModal(false)}}>ОК</Button>
        </Box>
      </Modal>
      <Snackbar
        open={isSnackBarOpen}
        autoHideDuration={6000}
        onClose={() => {setIsSnackBarOpen(false)}}
        message={snackBarMessage}
        action={action}
      />
    <div className="drawer">
    <Typography className='title' variant="h4">
         Оформление заказа
       </Typography>
    <Typography className='text1' variant="h5">
         Введите адрес
    </Typography>
  
    <br />
    {fields.map((field) => (
        <Autocomplete
          key={field.id}
          disablePortal
          id={`combo-box-${field.id}`}
          options={usedAdresses?.length ? usedAdresses : []}
          sx={{ width: '100%', marginBottom: '10px' }}
          value={field.address}
          onChange={(event, newValue) => handleAddressChange(field.id, newValue?.label || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label={field.label}
              value={field.address}
              onChange={(e) => handleAddressChange(field.id, e.target.value)}
            />
          )}
          />
        ))}
    <div className='add-address'>
    {isAddButton ?
    <Fab 
    size="small" 
    aria-label="add" 
    sx={{bgcolor: 'green', color: 'white', textAlign: 'center'}}
    onClick={addField} >
        <AddIcon />
      </Fab>
      : <div></div>}
      {isRemoveButton?
    <Fab 
    size="small" 
      aria-label="remove" 
      sx={{bgcolor: 'red', color: 'white', textAlign: 'center'}}
      onClick={removeField} >
        <RemoveIcon/>
      </Fab>
      : <div></div>}
      </div>
      <Typography className='text1' variant="h5">
         Выберите способ оплаты
    </Typography>
      <div className='select-conteiner'>
        
       <MenuItemWithImg 
       imgSrc={CashIcon} 
       Name='Наличными'
       isSelected={typeOfPayment === 'cash'}
       onClick={() => handleTypeOfPaymentSelection('cash')}/>
       <MenuItemWithImg 
       imgSrc={BankCardIcon} 
       Name='Картой'
       isSelected={typeOfPayment === 'card'}
       onClick={() => handleTypeOfPaymentSelection('card')}/>
      </div>
      <Typography className='text1' variant="h5">
         Выберите тип заказа
    </Typography>
      <div className='select-conteiner'>
       
       <MenuItemWithImg
      imgSrc={PassangerIcon} 
      Name='Пассажирсий'
      isSelected={typeOfOrder === 'passanger'}
      onClick={() => handleTypeOfOrderSelection('passanger')}/>
       <MenuItemWithImg 
       imgSrc={CargoIcon} 
       Name='Грузовой'
       isSelected={typeOfOrder === 'cargo'}
       onClick={() => handleTypeOfOrderSelection('cargo')}/>
      </div>
      {!isButtonPressed ? 
      <Button 
      sx={{ bgcolor: '#fdc501', mb:'20px', mt: '20px' }} 
      type='submit' 
      size="large" 
      variant="contained" 
      fullWidth
      onClick={() => {setIsButtonPressed(true)}} >
        Далее
      </Button>
    
      : <div>
        <AdditionalOrderDetails 
      typeOfOrder={typeOfOrder}
      numberOfPassengers={numberOfPassengers}
      setNumberOfPassengers={setNumberOfPassengers}
      classOfService={classOfService}
      setClassOfService={setClassOfService}
      cargoWeight={cargoWeight}
      setCargoWeight={setCargoWeight}
      dimensionsOfTheCargo={dimensionsOfTheCargo}
      setDimensionsOfTheCargo={setDimensionsOfTheCargo}
      typeOfCargo={typeOfCargo}
      setTypeOfCargo={setTypeOfCargo}/>
      <Button 
      sx={{ bgcolor: '#fdc501', mb:'20px', mt: '20px' }} 
      disabled={false} 
      type='submit' 
      size="large" 
      variant="contained" 
      fullWidth
      onClick={handleСheckout}>
        Оформить заказ
      </Button>
      </div>}
      
       </div>
    </div>
    </>
)};
