import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';

import Button from '@mui/material/Button';


export const ReviewDrawer = (props) => {
    const [ratingValue, setRatingValue] = React.useState(0);
    const [commentText, setCommentText] = React.useState('');
    

    const SendReview = async (event) => {
      event.preventDefault();
      try {
        event.preventDefault();
        const data ={
            OrderID: props.selectOrderId[0],
            Description: null,
            Evaluation: ratingValue,
        }
        if (commentText)
          data.Description = commentText;
          const response = await axios.post(`http://localhost:4444/AddReview`, data, {
              headers: {
                  authorization: `Bearer ${props.token}`
              }
              
            });
            if(response.data.success) {
              props.setMessageOpen(true)
              props.setSnackBarMessahe(response.data.message);
            } 
            
      } catch (error) {
        props.setMessageOpen(true)
        props.setSnackBarMessahe(error.response.data.error);
      }
      finally {
      }
    };


    const toggleDrawer = (newOpen) => () => {
        props.setOpen(newOpen);
    };

    const handleSendReview = (event) =>{
      if (ratingValue && props.selectOrderId[0]){
        SendReview(event);
      }else {
        props.setMessageOpen(true)
        props.setSnackBarMessahe("Не заполнены все обязательные поля");
        }
    } 
    return (
        <div>
       <Drawer 
       anchor='right'
       open={props.open}
        onClose={toggleDrawer(false)}>
        <Box sx={{ alignItems: 'center', padding: '20px',  textAlign: 'center', width: '400px'}}>
        <Typography marginTop={'20px'} id="modal-modal-title" variant="h4" component="h2">
            Оставить отзыв
          </Typography>
          <Typography marginTop={'20px'} marginBottom={'10px'} id="modal-modal-title" variant="h6" component="h2">
            Выбирите заказ
          </Typography>
          <FormControl required sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="OrderNumber-label">Номер заказа</InputLabel>
        <Select
          labelId="OrderNumber-label"
          id="OrderNumber"
          value={props.selectOrderId[0]}
          label="OrderNumber"
        >
          <MenuItem value={props.selectOrderId[0]}>
            <em>{props.selectOrderId[0]}</em>
          </MenuItem>
        </Select>
      </FormControl>
      
          <Typography marginTop={'20px'} marginBottom={'10px'} id="modal-modal-title" variant="h6" component="h2">
            Поставте оценку*
          </Typography>
          <Rating 
          name="size-large" 
          value={ratingValue}
          required
          onChange={(event, newValue) => {
            setRatingValue(newValue);
          }}
          size="large" />
          <Typography marginTop={'20px'} marginBottom={'10px'} id="modal-modal-title" variant="h6" component="h2">
            Оставить комментарий
          </Typography>
          <TextField
          id="outlined-multiline-static"
          label="Комментарий"
          multiline
          rows={4}commentText
          value={commentText}
          onChange={(event) => {
            setCommentText(event.target.value);
          }}
          fullWidth
        />
        <Button 
        sx={{ bgcolor: '#fdc501', mt: '20px', width: '100%' }} 
        disabled={false} 
        size="large" 
        variant="contained" 
        onClick={handleSendReview}
        type='Submit'> 
            Оставить отзыв
        </Button>
        </Box>
      </Drawer>
       </div>
  )};
  