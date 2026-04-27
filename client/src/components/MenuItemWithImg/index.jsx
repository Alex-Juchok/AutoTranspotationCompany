// import CssBaseline from '@mui/material/CssBaseline';
// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';

// import './header.css'
// import CompanyLogo from '../../assets/images/Company_logo.png'
// import Checkout from '../../assets/images/images-removebg-preview.png'
// import AnalysisIcon from '../../assets/images/png-transparent-computer-icons-data-analysis-business-business-trademark-people-logo-Photoroom.png-Photoroom.png'
// import personalAccount from '../../assets/images/download-Photoroom.png-Photoroom.png'
import Typography from '@mui/material/Typography';


export const MenuItemWithImg = (props) => {
    

    return (
      <div className={`selectBtn ${props.isSelected ? 'selected' : ''}`} onClick={props.onClick}>
        <div className='image-element'>
          <img src={props.imgSrc} alt="" />
          </div>

          <Typography className='text1' cx={{textAlign: 'centers'}} variant="h7">
         {props.Name}
       </Typography>
       </div>
  )};
  