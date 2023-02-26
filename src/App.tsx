import { useEffect, useState, useRef, Fragment } from 'react';
import './styles/App.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Brush,
} from 'recharts';
import Login from './components/Login';
import { months } from './utils';

type Data = {
  month: string;
  year: string;
  day: string;
  cpu_hours: string;
};

export function App() {
  const [data, setData] = useState<Data[]>([]);
  const [displayedData, setDisplayedData] = useState<any[]>([]);
  const [isLineChart, setIsLineChart] = useState(false);
  const [showMonthly, shouldShowMonthly] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    call();
  }, []);

  const call = async (year = '2017') => {
    try {
      const res = await fetch(`http://52.87.152.189:8000/data/${year}/`);
      const data = await res.json();
      setData(data.data);

      handleMonthChange(null, data.data);
      if (isLoggedIn) {
        selectRef.current!.value = '1';
      }
    } catch (err: any) {
      console.log(err.username);
    }
  };

  const handleMonthChange = (e?: any, incomingData: Data[] = data) => {
    setDisplayedData([]);

    const value = e?.target.value || '1';
    const currentMonthData = incomingData.filter(
      (individualData) => individualData.month === value,
    );

    currentMonthData.forEach((data, i) => {
      setDisplayedData((prevData :any) => [
        ...prevData,
        { name: `Day ${i + 1}`, cpuHours: data.cpu_hours },
      ]);
    });
  };

  useEffect(() => {
    if (showMonthly) {
      setDisplayedData([]);
      const total: number[] = [];
      data.forEach((newData : any) => {
        total[parseInt(newData.month) - 1] =
          (total[parseInt(newData.month) - 1] || 0) + parseFloat(newData.cpu_hours);
      });

      total.forEach((val, i) => {
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 31, 31];
        const average = val / daysInMonth[i];
        setDisplayedData((prevData : any) => [
          ...prevData,
          { name: months[i], cpuHours: average.toFixed(2) },
        ]);
      });
    } else {
      handleMonthChange();
    }
  }, [showMonthly, data]);

  return (
    <Fragment>
      {!isLoggedIn ? (
        <Login setIsLoggedIn={() => setIsLoggedIn(true)} />
      ) : (
        <div className='main'>
          <h2>Welcome to the CPU Usage Charts</h2>
          <p>It simple to use. Just select the year, and the month, and we show you the data</p>
          <div className='flex'>
            <select onChange={(e) => call(e.target.value)}>
              <option value='2017'>2017</option>
              <option value='2018'>2018</option>
              <option value='2019'>2019</option>
              <option value='2020'>2020</option>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
            </select>
            <div className='check'>
              <input
                type='checkbox'
                checked={isLineChart}
                onChange={() => setIsLineChart(!isLineChart)}
              />
              <span className='label'>{isLineChart ? 'Bar Chart' : 'Line Chart'}</span>
            </div>
            <div className='check'>
              <input
                type='checkbox'
                checked={showMonthly}
                onChange={() => shouldShowMonthly(!showMonthly)}
              />
              <span className='label'>Filter by monthly Average</span>
            </div>
            <select ref={selectRef} disabled={showMonthly} onChange={handleMonthChange}>
              <option value='1'>January</option>
              <option value='2'>February</option>
              <option value='3'>March</option>
              <option value='4'>April</option>
              <option value='5'>May</option>
              <option value='6'>June</option>
              <option value='7'>July</option>
              <option value='8'>August</option>
              <option value='9'>September</option>
              <option value='10'>October</option>
              <option value='11'>November</option>
              <option value='12'>December</option>
            </select>
          </div>
          <div className='chart'>
            {!isLineChart ? (
              <LineChart width={1200} height={500} data={displayedData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis domain={[0, 100]} tickCount={10} />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='cpuHours' activeDot={{ r: 8 }} stroke='#8884d8' />
                <Brush dataKey='name' height={8} stroke='#8884d8' />
              </LineChart>
            ) : (
              <BarChart width={1200} height={500} data={displayedData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis domain={[0, 100]} tickCount={10} />
                <Tooltip />
                <Legend />
                <Bar dataKey='cpuHours' fill='#8884d8' />
                <Brush dataKey='name' height={8} stroke='#8884d8' />
              </BarChart>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
}
