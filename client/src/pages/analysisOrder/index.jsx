import {useState, useEffect, Fragment, useContext} from 'react';

import { Header } from "../../components/header";
import { AnalysisParametr } from "../../components/AnalysisParametr";
import { BarChartAnalisys } from "../../components/BarChartAnalysis";
import { LineChartsAnalysys } from "../../components/LineChartsAnalysis";
import { AnalysisTable } from "../../components/Tables/AnalysisTableWithoutSelect";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { AnalysisProvider } from '../../components/context/analysisContext';




// import Button from '@mui/material/Button';
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

export const AnalysisOrderPage = () => {
  const [value, setValue] = useState(0);
  const [isAnalized, setIsAnalized] = useState(false);
  const [userData, setUserData] = useState(null);
  const [snackBarMessage, setSnackBarMessage] = useState();
  const [messageOpen, setMessageOpen] = useState(false);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

 

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setMessageOpen(false);
  };


  const action = (
    <Fragment>
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
    </Fragment>
  );
  
  const dataset = [
    {
        PeriodStart: '1994-01-01T00:00:00.000Z',
        PeriodEnd: '1995-01-01T00:00:00.000Z',
        TotalCost: 986989,
        TotalPathLength: 9787.26,
        TotalTravelTime: '23:08:00',
        OrderCount: 199,
        TotalPassengers: 463,
        TotalCargoWeight: 24558.1,
        "totalTimeInMinutes": 2691
      },
      {
        PeriodStart: '1995-01-01T00:00:00.000Z',
        PeriodEnd: '1996-01-01T00:00:00.000Z',
        TotalCost: 1917543.36,
        TotalPathLength: 19077.11,
        TotalTravelTime: '75:12:00',
        OrderCount: 386,
        TotalPassengers: 957,
        TotalCargoWeight: 46863.88,
        "totalTimeInMinutes": 2691
      },
      {
        PeriodStart: '1996-01-01T00:00:00.000Z',
        PeriodEnd: '1997-01-01T00:00:00.000Z',
        TotalCost: 2004752.92,
        TotalPathLength: 18719.93,
        TotalTravelTime: '56:59:00',
        OrderCount: 388,
        TotalPassengers: 792,
        TotalCargoWeight: 46421.23,
        "totalTimeInMinutes": 2691
      },
      {
        PeriodStart: '1997-01-01T00:00:00.000Z',
        PeriodEnd: '1998-01-01T00:00:00.000Z',
        TotalCost: 2128508.86,
        TotalPathLength: 21516.42,
        TotalTravelTime: '66:55:00',
        OrderCount: 421,
        TotalPassengers: 847,
        TotalCargoWeight: 60227.09,
        "totalTimeInMinutes": 2691

      },
      {
        PeriodStart: '1998-01-01T00:00:00.000Z',
        PeriodEnd: '1999-01-01T00:00:00.000Z',
        TotalCost: 2184773.85,
        TotalPathLength: 22122.91,
        TotalTravelTime: '77:08:00',
        OrderCount: 438,
        TotalPassengers: 920,
        TotalCargoWeight: 59777.8,
        "totalTimeInMinutes": 2691

      },
      {
        PeriodStart: '1999-01-01T00:00:00.000Z',
        PeriodEnd: '2000-01-01T00:00:00.000Z',
        TotalCost: 2112519.27,
        TotalPathLength: 22361.5,
        TotalTravelTime: '96:32:00',
        OrderCount: 428,
        TotalPassengers: 998,
        TotalCargoWeight: 50901.41,
        "totalTimeInMinutes": 2691
      },
      {
        PeriodStart: '2000-01-01T00:00:00.000Z',
        PeriodEnd: '2001-01-01T00:00:00.000Z',
        TotalCost: 2112314.48,
        TotalPathLength: 21748.34,
        TotalTravelTime: '55:51:00',
        OrderCount: 431,
        TotalPassengers: 992,
        TotalCargoWeight: 49609.73,
        "totalTimeInMinutes": 2691
      },
      {
        PeriodStart: '2001-01-01T00:00:00.000Z',
        PeriodEnd: '2002-01-01T00:00:00.000Z',
        TotalCost: 1966022.47,
        TotalPathLength: 19522.59,
        TotalTravelTime: '28:22:00',
        OrderCount: 389,
        TotalPassengers: 934,
        TotalCargoWeight: 49292.9,
        "totalTimeInMinutes": 2691
      },
      {
        PeriodStart: '2002-01-01T00:00:00.000Z',
        PeriodEnd: '2003-01-01T00:00:00.000Z',
        TotalCost: 2049582.77,
        TotalPathLength: 21122.02,
        TotalTravelTime: '22:48:00',
        OrderCount: 414,
        TotalPassengers: 993,
        TotalCargoWeight: 46843.28,
        "totalTimeInMinutes": 2691
      },
      {
        PeriodStart: '2003-01-01T00:00:00.000Z',
        PeriodEnd: '2004-01-01T00:00:00.000Z',
        TotalCost: 2242582.3,
        TotalPathLength: 21660.84,
        TotalTravelTime: '80:09:00',
        OrderCount: 432,
        TotalPassengers: 943,
        TotalCargoWeight: 59528.54,
        "totalTimeInMinutes": 2691
      },
      {
        PeriodStart: '2004-01-01T00:00:00.000Z',
        PeriodEnd: '2005-01-01T00:00:00.000Z',
        TotalCost: 1914259.02,
        TotalPathLength: 20118.98,
        TotalTravelTime: '39:10:00',
        OrderCount: 390,
        TotalPassengers: 900,
        TotalCargoWeight: 52395.4,
        "totalTimeInMinutes": 2691
      },
      {
        PeriodStart: '2005-01-01T00:00:00.000Z',
        PeriodEnd: '2006-01-01T00:00:00.000Z',
        TotalCost: 2159321.47,
        TotalPathLength: 20437.57,
        TotalTravelTime: '63:24:00',
        OrderCount: 407,
        TotalPassengers: 942,
        TotalCargoWeight: 52876.92,
        "totalTimeInMinutes": 2691
      },
      {
        PeriodStart: '2006-01-01T00:00:00.000Z',
        PeriodEnd: '2007-01-01T00:00:00.000Z',
        TotalCost: 2028348.89,
        TotalPathLength: 19163.19,
        TotalTravelTime: '34:59:00',
        OrderCount: 397,
        TotalPassengers: 910,
        TotalCargoWeight: 46638.04,
        "totalTimeInMinutes": 2691
      },
      {
        PeriodStart: '2007-01-01T00:00:00.000Z',
        PeriodEnd: '2008-01-01T00:00:00.000Z',
        TotalCost: 1832010.51,
        TotalPathLength: 17808.16,
        TotalTravelTime: '66:47:00',
        OrderCount: 367,
        TotalPassengers: 846,
        TotalCargoWeight: 42425.63,
        "totalTimeInMinutes": 2691
      },
      {
        PeriodStart: '2008-01-01T00:00:00.000Z',
        PeriodEnd: '2009-01-01T00:00:00.000Z',
        TotalCost: 2145256.53,
        TotalPathLength: 20263.66,
        TotalTravelTime: '85:27:00',
        OrderCount: 412,
        TotalPassengers: 1013,
        TotalCargoWeight: 50660.26,
        "totalTimeInMinutes": 2691
      },
      {
        PeriodStart: '2009-01-01T00:00:00.000Z',
        PeriodEnd: '2010-01-01T00:00:00.000Z;',
        TotalCost: 1830696.74,
        TotalPathLength: 18001.47,
        TotalTravelTime: '24:14:00',
        OrderCount: 368,
        TotalPassengers: 984,
        TotalCargoWeight: 40893.75,
        "totalTimeInMinutes": 2691
      }
    ]


    useEffect(() => {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    }, []);

    // useEffect(() => {
    //   if (userData?.Token) {
    //     GetAllOrders();
    //   }
    // }, [userData?.Token]);

  return (
    <>
    <Header/>
    <div className='Content3'>
       
    <Snackbar
        open={messageOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackBarMessage}
        action={action}
      /> 
              <AnalysisProvider>
      <AnalysisParametr 
      setIsAnalized={setIsAnalized}
      userData={userData}
      setMessageOpen={setMessageOpen}
      setSnackBarMessage={setSnackBarMessage}/>
    
      {isAnalized?<>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: '10px' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Столбчатый график" {...a11yProps(0)} />
          <Tab label="Линейный график" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Box sx={{ alignItems: 'center', padding: '20px',  textAlign: 'center', border: '1px solid', borderRadius: "20px", mb: "20px"}}>
      <CustomTabPanel value={value} index={0}>
        <BarChartAnalisys dataset={dataset}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <LineChartsAnalysys dataset={dataset}/>
      </CustomTabPanel>
     
      </Box>
      <AnalysisTable dataset={dataset}/>
      </> : <div></div>}
      </AnalysisProvider>

    </div>
    </>
)};