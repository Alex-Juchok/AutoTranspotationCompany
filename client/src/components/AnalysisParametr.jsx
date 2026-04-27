import { useState, useEffect, useContext } from 'react'; 
import axios from 'axios';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import { AnalysisContext } from './context/analysisContext';



export const AnalysisParametr = (props) => {
    const [startPeriod, setStartPeriod] = useState();
    const [endPeriod, setEndPeriod] = useState();
    const [periodType, setPeriodType] = useState('');
    const [aggregationType, setAggregationType] = useState('');
    const [showCompletedOnly, setShowCompletedOnly] = useState(false);
    const [orderType, setOrderType] = useState(null);
    const [classOfService, setClassOfService] = useState(null);
    const [typeOfCargo, setTypeOfCargo] = useState(null);
    const { setAnalysisData } = useContext(AnalysisContext);


    const [classOfServiceOption, setClassOfServiceOption] = useState();
    const [typeOfCargoOption, setTypeOfCargoOption] = useState();

    const GetClassOfService = async () => {
      try {
          const response = await axios.get(`http://localhost:4444/OrderDetails/classOfService`, {});
          if(response.data.success){
            setClassOfServiceOption(response.data[0])
          }
      } catch (error) {
        
      }
      finally {
        
      }
    };

    const GetTypeOfCargo = async () => {
      try {
          const response = await axios.get(`http://localhost:4444/OrderDetails/typeOfCargo`, {});
          if(response.data.success){
            setTypeOfCargoOption(response.data[0])
          }
      } catch (error) {
        
      }
      finally {
        
      }
    };


    const RequestAnalysis = async (event) => {
      try {
          const data = {
            "UserID": props.userData?.ID,
            "StartPeriod": startPeriod.format('YYYY-MM-DD'),
            "EndPeriod": endPeriod.format('YYYY-MM-DD'),
            "PeriodType": periodType,
            "AggregationType": aggregationType,
            "OrderType": orderType,
            "ClassOfService": classOfService,
            "TypeOfCargo": typeOfCargo 
          }
          
          if (showCompletedOnly)
            data.showCompletedOnly=1;
          else  data.showCompletedOnly=0;
         event.preventDefault();
          const response = await axios.post(`http://localhost:4444/AnalysisOrders`, data, {
              headers: {
                  authorization: `Bearer ${props.userData?.Token}`
              }
              
            });
            if(response.data.success) {
              // setSnackBarMessahe(response.data.message);
              // setOpen(true);
              // await GetAllOrders(); 
              
              setAnalysisData(response.data[0])
              props.setIsAnalized(true);
            } 
            
      } catch (error) {
        //setSnackBarMessahe(error.response.data.error);
        //setOpen(true);
      }
      finally {
      }
    };
      useEffect(() => {
        GetClassOfService();
        GetTypeOfCargo();
      }, []);

    const handleAnalysisOrder = (event) => {
      if(startPeriod && endPeriod && periodType && aggregationType){
        console.log(startPeriod.format('YYYY-MM-DD'))
        console.log(endPeriod.format('YYYY-MM-DD'))
        console.log(periodType+" : "+aggregationType+" : "+showCompletedOnly+" : "+orderType+" : "+classOfService+" : "+typeOfCargo);
        RequestAnalysis(event);
      }
      else{
        props.setMessageOpen(true)
        props.setSnackBarMessage("Не заполнены все обязательные поля");
      }
    }


    const periodTypeOptions = [
        {
          id: 'day',
          label: 'День',
        },
        {
          id: 'month',
          label: 'Месяц',
        },
        {
          id: 'quarter',
          label: 'Квартал',
        },
        {
          id: 'year',
          label: 'Год',
        }]

    const aggregationTypeOptions = [
        {
        id: 'total',
          label: 'Общее',
        },
        {
          id: 'average',
          label: 'Среднее',
        }]

    const orderTypeOptions = [
        {
          id: 'passenger',
          label: 'Пассажирский',
        },
        {
          id: 'cargo',
          label: 'Грузовой',
        }]


    const handlePeriodTypeChange = (event) => {
        setPeriodType(event.target.value);
    };
    
    const handleAggregationTypeChange = (event) => {
        setAggregationType(event.target.value);
    };

    const handleShowCompletedOnlyChange = (event) => {
        setShowCompletedOnly(event.target.checked);
    };

    const handleOrderTypeChange = (event) => {
        setOrderType(event.target.value);
    };

    const handleClassOfServiceChange = (event) => {
        setClassOfService(event.target.value);
    };

    const handleTypeOfCargoChange = (event) => {
        setTypeOfCargo(event.target.value);
    };


    return (
        <Box sx={{ bgColor: 'lightblue', alignItems: 'center', padding: '20px',  textAlign: 'center', border: '1px solid', borderRadius: "20px", mb: '20px'}}>
        <Typography id="Choose-parametr-for-analysis-title" variant="h6" component="h2" mb={'20px'}>
            Выбирите параметры анализа
          </Typography>
          <Stack spacing={2} direction="row">
         
             <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker 
                label="Начальный период*" 
                value={startPeriod}
                maxDate={(dayjs())}
                onChange={(newValue) => setStartPeriod(newValue)}/> 
                <DatePicker 
                label="Конечный период*" 
                value={endPeriod}
                maxDate={(dayjs())}
                onChange={(newValue) => setEndPeriod(newValue)}/> 
            </LocalizationProvider>
            <FormControl required sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="PeriodType-label">Тип периода</InputLabel>
        <Select
          labelId="PeriodType-label"
          id="PeriodType"
          value={periodType}
          label="PeriodType"
          onChange={handlePeriodTypeChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {periodTypeOptions.map((periodTypeOption) => (
                    <MenuItem value={periodTypeOption.id}>{periodTypeOption.label}</MenuItem>
            ))}
        </Select>
        <FormHelperText>Выбирите тип периода</FormHelperText>
      </FormControl>
      <FormControl required sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="AggregationType-label">Тип агрегации</InputLabel>
        <Select
          labelId="AggregationType-label"
          id="AggregationType"
          value={aggregationType}
          label="AggregationType"
          onChange={handleAggregationTypeChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {aggregationTypeOptions.map((aggregationTypeOption) => (
                    <MenuItem value={aggregationTypeOption.id}>{aggregationTypeOption.label}</MenuItem>
            ))}
        </Select>
        <FormHelperText>Выбирите тип агрегации</FormHelperText>
      </FormControl>
      
      
      <FormControlLabel control={
      <Checkbox
       checked={showCompletedOnly}
      onChange={handleShowCompletedOnlyChange} />} 
      label="Только завершенные заказы" />
        </Stack>
        <Stack spacing={2} direction="row">
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="orderType-label">Тип заказа</InputLabel>
            <Select
            labelId="orderType-label"
            id="orderType"
            value={orderType}
            label="orderType"
            onChange={handleOrderTypeChange}
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {orderTypeOptions.map((orderTypeOption) => (
                    <MenuItem value={orderTypeOption.id}>{orderTypeOption.label}</MenuItem>
            ))}
            </Select>
        <FormHelperText>Выбирите тип заказа</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="classOfService-label">Класс обслуживания</InputLabel>
            <Select
            labelId="classOfService-label"
            id="classOfService"
            value={classOfService}
            label="classOfService"
            onChange={handleClassOfServiceChange}
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {classOfServiceOption?.map((clssOfSrvc) => (
                    <MenuItem value={clssOfSrvc.Name}>{clssOfSrvc.Name}</MenuItem>
            ))}
            </Select>
        <FormHelperText>Выбирите класс обслуживания</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="typeOfCargo-label">Тип груза</InputLabel>
            <Select
            labelId="typeOfCargo-label"
            id="typeOfCargo"
            value={typeOfCargo}
            label="typeOfCargo"
            onChange={handleTypeOfCargoChange}
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {typeOfCargoOption?.map((tpOfCrgOptn) => (
                    <MenuItem value={tpOfCrgOptn.Name}>{tpOfCrgOptn.Name}</MenuItem>
            ))}
            </Select>
        <FormHelperText>Выбирите тип груза</FormHelperText>
      </FormControl>
      </Stack>
      <Button 
      sx={{ bgcolor: '#fdc501' }} 
      disabled={false} 
      type='submit' 
      size="large" 
      variant="contained" 
      onClick={handleAnalysisOrder}>
        Анализировать
      </Button>
    </Box>
  )};