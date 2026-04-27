import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Liststyle = {
    p: 0,
    width: '100%',
    maxWidth: 600,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
  };
export const OrderDetailsModal = (props) => {
     const handleOpen = () => props.setOpen(true);
    const handleClose = () => props.setOpen(false);
    const [isLoading, setLoading] = React.useState(false);


    return (
        <div>
            <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Полные данные заказа
          </Typography>
          {isLoading ? (
            <Box sx={{ bgcolor: '#f3f3f3', display: 'flex', height: '600px', alignItems: 'center',   textAlign: 'center', paddingLeft: '47%'}} >
            <CircularProgress color="secondary" cx={{alignItems: 'center',   textAlign: 'center'}} />
            </Box>
          ):(
            <Grid container spacing={2}>
        <Grid item xs={6}>
        <List sx={Liststyle} aria-label="mailbox folders">
        <ListItem>
        <ListItemText primary="Номер заказа: " /> {props.dataset?.Order_number}
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Стоимость: " /> {props.dataset?.Cost}
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Длинна пути: " /> {props.dataset?.Path_lenght}
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Время пути: " /> {props.dataset?.Travel_time}
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Тип оплаты: " /> {props.dataset?.Type_of_payment}
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Тип заказа: " /> {props.dataset?.Type_of_order}
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Начальный адрес: " /> <div style={{width: 300, marginLeft: 50}}>{props.dataset?.StartAddress}</div>
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Конечный адрес: " /> <div style={{width: 300, marginLeft: 50}}>{props.dataset?.EndAddress}</div>
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Промежуточные адреса: &nbsp;" /> <div style={{width: 300}}>{props.dataset?.IntermediateAddresses}</div>
      </ListItem>
    </List>
        </Grid>
        <Grid item xs={6}>
        <List sx={Liststyle} aria-label="mailbox folders">
      <ListItem>
        <ListItemText primary="История статуса:&nbsp;  " /> {props.dataset?.StatusHistory}
      </ListItem>
      <Divider component="li" />
  {props.dataset?.Number_of_passengers && (
    <>
      <ListItem>
        <ListItemText primary="Количесво пассажиров: " /> {props.dataset?.Number_of_passengers}
      </ListItem>
      <Divider component="li" />
    </>
  )}

  {props.dataset?.Class_of_service && (
    <>
      <ListItem>
        <ListItemText primary="Класс обслуживания: " /> {props.dataset?.Class_of_service}
      </ListItem>
      <Divider component="li" />
    </>
  )}
{props.dataset?.Cargo_weight && (
    <>
      <ListItem>
        <ListItemText primary="Вес груза: " /> {props.dataset?.Cargo_weight}
      </ListItem>
      <Divider component="li" />
    </>
  )}
  {props.dataset?.Dimensions_of_the_cargo && (
    <>
      <ListItem>
        <ListItemText primary="Измерение груза: " /> {props.dataset?.Dimensions_of_the_cargo}
      </ListItem>
      <Divider component="li" />
    </>
  )}
  {props.dataset?.Type_of_cargo && (
    <>
      <ListItem>
        <ListItemText primary="Тип груза: " /> {props.dataset?.Type_of_cargo}
      </ListItem>
      <Divider component="li" />
    </>
  )}
      {/* <ListItem>
        <ListItemText primary="Вес груза: " /> {props.dataset?.Cargo_weight}
      </ListItem>
      <Divider component="li" /> */}
      {/* <ListItem>
        <ListItemText primary="Измерение груза: " /> {props.dataset?.Dimensions_of_the_cargo}
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Тип груза: " /> {props.dataset?.Type_of_cargo}
      </ListItem>
      <Divider component="li" /> */}
      <ListItem>
        <ListItemText primary="Описание отзыва: " /> {props.dataset?.ReviewDescp}
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Оценка: " /> {props.dataset?.ReviewEvaluation}
      </ListItem>
      {/* <Divider component="li" />
      <ListItem>
        <ListItemText primary="Номер автомобиля: " /> {props.dataset.Vehicle_number}
      </ListItem> */}
    </List>
        </Grid>
        
      </Grid>
          )}
          
          <br />
          <Button onClick={handleClose}>закрыть</Button>
        </Box>
      </Modal>
        </div>
  )};