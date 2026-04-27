import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Stack from '@mui/material/Stack';
import { AnalysisContext } from './context/analysisContext';




const minDistance = 1;

  const chartSetting = {
    width: 1000,
    height: 500,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-20px, 0)',
      },
    },
  };

export const BarChartAnalisys = (props) => {
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
    };

    const handleIsPathLengthInChartsChange = (event) => {
        setIsPathLengthInCharts(event.target.checked);
    };

    const handleIsOrderCountInChartsChange = (event) => {
        setIsOrderCountInCharts(event.target.checked);
    };

    const handleIsPassangerCountInChartsChange = (event) => {
        setIsPassangerCountInCharts(event.target.checked);
    };

    const handleIsCargoWeightInChartsChange = (event) => {
        setIsCargoWeightInCharts(event.target.checked);
    };

    let series=[
        isCostInCharts ? { dataKey: 'TotalCost', label: 'Общая стоимость' } : null,
        isPathLengthInCharts ? { dataKey: 'TotalPathLength', label: 'Общая длинна пути' }: null,
        isOrderCountInCharts ? { dataKey: 'OrderCount', label: 'Общее кол-во заказов' }: null,
        isPassangerCountInCharts ? { dataKey: 'TotalPassengers', label: 'Общее кол-во пассажиров' }:null,
        isCargoWeightInCharts ? { dataKey: 'TotalCargoWeight', label: 'Общий вес груза' }:null,
      ].filter(Boolean);

      
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
        <BarChart
        
        dataset={analysisData?.slice(value1[0], value1[1])}
        width={1000}
        height= {500}
        xAxis={[{ scaleType: 'band', dataKey: 'PeriodEnd' }]}
        series={series}
          {...chartSetting}
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