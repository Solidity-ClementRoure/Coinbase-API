import React, { Component, useEffect, useState } from "react";
import Chart from "react-google-charts";
import { BallTriangle } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Select from "../widgets/Select";

export const options = {
  legend: "none",
  bar: { groupWidth: "95%" }, // Remove space between bars.
  candlestick: {
    fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
    risingColor: { strokeWidth: 0, fill: "#0f9d58" }, // green
  },
  colors: ['#262626'],
  vAxis: {
    // format: '$'
  } ,
  // explorer: { 
  //        // actions: ["dragToZoom", "rightClickToReset"], 
  //           maxZoomIn: 0.2,
  //           maxZoomOut: 1.0,
  //           zoomDelta: 10,
  //           axis: "vertical",
  //           keepInBounds: true
  //         },
};

function ChartPage (){

  const [pair, setPair] = useState("BTC-USD");
  const [granularity, setGranularity]  = useState(300)

  const [price, setPrice] = useState(0)

  const [data, setData] = useState([
    ['time', 'min', 'max', 'open', 'close'],
  ]);

  useEffect(() => {
    refreshDataCandle(pair, granularity);
  },[])

  const refreshDataCandle = async (pair: string, granularity: number) => {

    await fetch(`http://localhost:4000/refreshDataCandle/${pair}/${granularity}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if(data.message == "NotFound"){
          alert("ERROR: Invalid pair. exemple: BTC-USD")
        }
        const _data = [['time', 'min', 'max', 'open', 'close']]
        for(let i = 0; i< 36; i++){
           const t0 = Intl.DateTimeFormat(navigator.language, {hour: '2-digit', minute:'2-digit'}).format(new Date(data[i][0] * 1000));
           const c1 = data[i][1]
           const c2 = data[i][2]
           const c3 = data[i][3]
           const c4 = data[i][4]
           _data.push([t0,c1,c3,c4,c2])
        }

        let reverse = (array:any, start:number, end:number) => {
          while (start < end) {
            let t = array[start];
            array[start++] = array[end];
            array[end--] = t;
          }
        };
        reverse(_data, 1, _data.length-1);
        console.log(_data)
        setData(_data)
        setPrice(data[0][3])
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const getCurrentPrice = async () => {

    await fetch(`http://localhost:4000/getCurrentPrice/${pair}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.message == "NotFound"){
          alert("ERROR: Invalid pair. exemple: BTC-USD")
        }
        setPrice(data.price)
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  // get current price each x seconds
  const delay = 1000;
  useEffect(() => {
    const interval = setInterval(() => {
      getCurrentPrice();
    }, delay);

    return () => clearInterval(interval); 
  }, [pair])

    // update chart x seconds
    // const delay2 = granularity * 1000;
    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     refreshDataCandle(pair, granularity);
    //   }, delay2);
  
    //   return () => clearInterval(interval); 
    // }, [pair, granularity])

    const buyOrder = async () => {

      await fetch(`http://localhost:4000/buyOrder`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      })
        .then((response) => response.json())
        .then((data) => {
          if(data.message == "NotFound"){
            alert("ERROR: Invalid pair. exemple: BTC-USD")
          }
          setPrice(data.price)
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    return (
        <div className="-mt-24 overflow-hidden">
              <p className="absolute left-1/2 top-2 text-semibold text-gray-800 z-50 text-lg -translate-x-24">{pair} - ${price}</p>
              <div className="flex flex-row space-x-4 mt-6 absolute left-1/2 -translate-x-60 bottom-2 z-50">
                <input value={pair} onChange={(e)=>setPair(e.target.value)} maxLength={8} type="text" className="h-10 w-20 px-1 text-xl font-semibold text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                
                <div className="flex flex-row">
                  {/* <p className="mt-2 mr-2 text-semibold text-gray-900">Timestep: </p> */}
                  <Select value={granularity} onChange={event => setGranularity(parseInt(event.target.value))} className="">
                    <option value={60}>1m</option>
                    <option value={300}>5m</option>
                    <option value={900}>15m</option>
                    <option value={3600}>1H</option>
                  </Select>
                </div>

                <button onClick={() => refreshDataCandle(pair, granularity)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    View
                </button>

                <button onClick={() => buyOrder()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Buy
                </button>
              </div>
              <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-20 absolute left-1/2 translate-x-40 bottom-2 z-50">
                Back
              </Link>      
              <Chart
                width={'100%'}
                height={800}
                chartType="CandlestickChart"
                // loader={<div className="relative grid h-screen place-items-center opacity-90">
                //           <BallTriangle width={50} height={50} color="#262626"/>
                //         </div>
                // }
                data={data}
                options={options}
                rootProps={{ 'data-testid': '1' }} 
              />       
          </div>   
    );
}

export default ChartPage;
