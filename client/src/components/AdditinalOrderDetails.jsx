import * as React from 'react';


import { MenuItemWithImg } from '../components/MenuItemWithImg'

import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';

import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';


import EconomClass from '../assets/images/download.png'
import EliteClass from '../assets/images/pngwing.com.png'
import ComfortClass from '../assets/images/car-icon-car-icon-car-icon-simple-sign-free-vector.png'
import BussinerClass from '../assets/images/business-class-machine-icon-260nw-1318291091.png'

export const AdditionalOrderDetails = (props) => {
  const [typeOfCargoOptions, setTypeOfCargoOptions] = React.useState({}) 

  const handleClassOfServiceSelection = (method) => {
    props.setClassOfService(method);
  };

 
    
  const GetUsedAddresses = async (event) => {
    try {
        const response = await axios.get(`http://localhost:4444/OrderDetails/typeOfCargo`, {});
          if(response.data.success) {
            setTypeOfCargoOptions(response.data[0].map(item => ({
              ID: item.ID,
              label: item.Name
            })));
            console.log(typeOfCargoOptions)
          } 
          
    } catch (error) {
      //setSnackBarMessahe(error.response.data.error);
      //setOpen(true);
      console.log(error)
    }
    finally {
    }
  };

    React.useEffect(() => {
      GetUsedAddresses();
  }, []);

  const handleCargoChange = (event, newValue) => {
    props.setTypeOfCargo(newValue ? newValue.ID : null);
  };

    if (props.typeOfOrder == 'passanger') {   
    return (
       <div>
<Typography className='text1' variant="h5">
         Введите количество пассажиров
    </Typography>
      <TextField
        className='field'
        label="Количество пассажиров"
        type="number"
        value={props.numberOfPassengers}
        onChange={(event) => props.setNumberOfPassengers(event.target.value)}
        fullWidth
      />
      <Typography className='text1' variant="h5">
         Введите класс обслуживания
    </Typography>
      <div className='select-conteiner'>
        <div>
       <MenuItemWithImg 
       imgSrc={EconomClass} 
       Name='Эконом'
       isSelected={props.classOfService === 'economy'}
       onClick={() => handleClassOfServiceSelection('economy')}/>
       <MenuItemWithImg 
       imgSrc={BussinerClass} 
       Name='Бизнес'
       isSelected={props.classOfService === 'business'}
       onClick={() => handleClassOfServiceSelection('business')}/>
       </div>
       <div>
      <MenuItemWithImg 
      imgSrc={ComfortClass} 
      Name='Комфорт'
      isSelected={props.classOfService === 'comfort'}
      onClick={() => handleClassOfServiceSelection('comfort')}/>
      <MenuItemWithImg 
      imgSrc={EliteClass} 
      Name='Элитный'
      isSelected={props.classOfService === 'elite'}
      onClick={() => handleClassOfServiceSelection('elite')}/>
      </div>   
      </div>
      <Typography className='text1' variant="h5">
         Введите комментарий
    </Typography>
      <TextField
          id="outlined-multiline-static"
          label="Комментарий"
          multiline
          rows={4}
          defaultValue=""
          fullWidth
        />
         
{/* Cargo order */}

       </div> 
  )}else if(props.typeOfOrder == 'cargo') {
    return(
        <div>
            <Typography className='text1' variant="h5">
         Введите вес груза
    </Typography>
      <TextField
        className='field'
        label="Вес груза"
        type="number"
        fullWidth
        value={props.cargoWeight}
        onChange={(event) => props.setCargoWeight(event.target.value)}
      /> 
      <Typography className='text1' variant="h5">
      Введите габариты груза
 </Typography>
   <TextField
     className='field'
     label="Габариты груза 0х0х0"
     type="text"
     value={props.dimensionsOfTheCargo}
     onChange={(event) => props.setDimensionsOfTheCargo(event.target.value)}
     fullWidth
   />
   <Typography className='text1' variant="h5">
      Введите вид грузового заказа
 </Typography>
 <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={typeOfCargoOptions}
      getOptionLabel={(option) => option.label}
      sx={{ width: '100%', mb: '10px' }}
      renderInput={(params) => <TextField {...params} label="Вид грузового заказа" />}
      onChange={handleCargoChange}
    />
      <Typography className='text1' variant="h5">
         Введите комментарий
    </Typography>
      <TextField
          id="outlined-multiline-static"
          label="Комментарий"
          multiline
          rows={4}
          defaultValue=""
          fullWidth
        />
        
        </div>
    )
  }else{
    return (
        <div>
            hr
        </div>
    )
  }};