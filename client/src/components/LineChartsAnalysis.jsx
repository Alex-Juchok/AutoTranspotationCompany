import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { LineChart } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import { AnalysisContext } from './context/analysisContext';



const keyToLabel = {
  };
 
  const minDistance = 1;

const colors = {
    TotalCost: 'lightgreen',
    TotalPathLength: 'yellow',
    OrderCount: 'blue',
    TotalPassengers: 'orange',
    TotalCargoWeight: 'gray',
  };
  
  const stackStrategy = {
    stack: 'total',
    area: false,
    stackOffset: 'none', // To stack 0 on top of others
  };
  
  const customize = {
    height: 300,
    legend: { hidden: true },
    margin: { top: 5 },
    stackingOrder: 'descending',
  };
  
export const LineChartsAnalysys = (props) => {
    const [isCostInCharts, setIsCostInCharts] = React.useState(false);
    const [isPathLengthInCharts, setIsPathLengthInCharts] = React.useState(false);
    const [isOrderCountInCharts, setIsOrderCountInCharts] = React.useState(false);
    const [isPassangerCountInCharts, setIsPassangerCountInCharts] = React.useState(false);
    const [isCargoWeightInCharts, setIsCargoWeightInCharts] = React.useState(false);
    const [value1, setValue1] = React.useState([0, 0]);


     
    const { analysisData } = React.useContext(AnalysisContext);

    React.useEffect(() => {
      setValue1([0, analysisData?.length])

    }, [])
    const handleChange1 = (event, newValue, activeThumb) => {
      if (!Array.isArray(newValue)) {
        return;
      }
  
      if (activeThumb === 0) {
        setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
      } else {
        setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
      }
    };
  
    const handleIsCostInChartsChange = (event) => {
        setIsCostInCharts(event.target.checked);
        if (isCostInCharts)
            delete keyToLabel.TotalCost
        else
            keyToLabel.TotalCost = 'Общая стоимость';
    };

    const handleIsPathLengthInChartsChange = (event) => {
        setIsPathLengthInCharts(event.target.checked);
        if (isPathLengthInCharts)
            delete keyToLabel.TotalPathLength
        else
            keyToLabel.TotalPathLength = 'Общая длинна пути';
    };

    const handleIsOrderCountInChartsChange = (event) => {
        setIsOrderCountInCharts(event.target.checked);
        if (isOrderCountInCharts)
            delete keyToLabel.OrderCount
        else
            keyToLabel.OrderCount = 'Общее кол-во заказов';
    };

    const handleIsPassangerCountInChartsChange = (event) => {
        setIsPassangerCountInCharts(event.target.checked);
        if (isPassangerCountInCharts)
            delete keyToLabel.TotalPassengers
        else
            keyToLabel.TotalPassengers = 'Общее кол-во пассажиров';
    };

    const handleIsCargoWeightInChartsChange = (event) => {
        setIsCargoWeightInCharts(event.target.checked);
        if (isCargoWeightInCharts)
            delete keyToLabel.TotalCargoWeight
        else
            keyToLabel.TotalCargoWeight = 'Общий вес груза';
    };


    //   series={Object.keys(keyToLabel).map((key) => ({
    //     dataKey: key,
    //     label: keyToLabel[key],
    //     color: colors[key],
    //     showMark: false,
    //     ...stackStrategy,
    //   }))}
    
    return (
        <div>
        <FormControlLabel control={
            <Checkbox
            checked={isCostInCharts}
            onChange={handleIsCostInChartsChange} />} 
            label="Стоимость" />
            <FormControlLabel control={
            <Checkbox
            checked={isPathLengthInCharts}
            onChange={handleIsPathLengthInChartsChange} />} 
            label="Длинна пути" />
            <FormControlLabel control={
            <Checkbox
            checked={isOrderCountInCharts}
            onChange={handleIsOrderCountInChartsChange} />} 
            label="Количество заказов" />
            <FormControlLabel control={
            <Checkbox
            checked={isPassangerCountInCharts}
            onChange={handleIsPassangerCountInChartsChange} />} 
            label="Количество пассажиров" />
            <FormControlLabel control={
            <Checkbox
            checked={isCargoWeightInCharts}
            onChange={handleIsCargoWeightInChartsChange} />} 
            label="Вес груза" />
        {/* <BarChart
        
        dataset={props.dataset}
        width={1000}
        height= {500}
        xAxis={[{ scaleType: 'band', dataKey: 'PeriodEnd' }]}
        series={series}
          {...chartSetting}
      /> */}
      <LineChart
      xAxis={[
        {
            scaleType: 'band', dataKey: 'PeriodEnd' },
      ]}
      series={Object.keys(keyToLabel).map((key) => ({
        dataKey: key,
        label: keyToLabel[key],
        color: colors[key],
        showMark: false,
        ...stackStrategy,
      }))}
      dataset={analysisData?.slice(value1[0], value1[1])}
      {...customize}
    />
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
      <div>{analysisData[0].PeriodEnd}</div>
      <Slider
        getAriaLabel={() => 'Minimum distance'}
        value={value1}
        onChange={handleChange1}
        valueLabelDisplay="auto"
        max={analysisData?.length}
        disableSwap
      />
  <div>{analysisData.at(-1).PeriodEnd}</div>
  </Stack>
    </Box>
     </div>
    
  )};

