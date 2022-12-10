import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ChartPage from './ChartPage';

function Page1() {

  const [cryptoList, setCryptoList] = useState<string[]>([])

  const [pair, setPair] = useState("BTC-USD")

  const [bid, setBid] = useState("")
  const [pairBid, setPairBid] = useState("BTC-USD")

  const [ask, setAsk] = useState("")
  const [pairAsk, setPairAsk] = useState("BTC-USD")

  const [bidList, setBidList] = useState<string[]>([])
  const [askList, setAskList] = useState<string[]>([])

  const listCrypto = async () => {

    await fetch('http://localhost:4000/crypto_list', {
      method: 'GET',
      // body: JSON.stringify({
      //   setupIntent_id: ""
      // }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let _list: Array<string> = []
        for(let i=0; i<data.length;i++){
          _list.push(data[i].id)
        }
        setCryptoList(_list);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const getDepth = async (pair: string, direction: string) => {

    await fetch(`http://localhost:4000/getDepth/${pair}`, {
      method: 'GET',
      // body: JSON.stringify({
      //   pair: "BTC-USD"
      // }),
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
        if(direction == "bid"){
          setBid(data.bids[0][0]);
          setPairBid(pair)
        }
        else{
          setAsk(data.asks[0][0])
          setPairAsk(pair)
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const getOrderBook = async () => {

    await fetch(`http://localhost:4000/getOrderBook/${pair}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.message == "NotFound"){
          alert("ERROR: Invalid pair. exemple: BTC-USD");
          return;
        }
        console.log(data)
        let _listBid: Array<string> = []
        let _listAsk: Array<string> = []
        for(let i=0; i<10;i++){
          _listBid.push(data.bids[i][0])
        }
        for(let i=0; i<10;i++){
          _listAsk.push(data.asks[i][0])
        }
        setBidList(_listBid);
        setAskList(_listAsk);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  return (
    <div className='grid place-items-center m-10'>
      
      <Link to={"/chart"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8">
        Chart Page
      </Link>
      <button onClick={listCrypto} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2">
        Crypto List
      </button>
      <div className="flex flex-row space-x-4 mt-6">
          <input value={pair} onChange={(e)=>setPair(e.target.value)} maxLength={7} type="text" className="h-10 w-16 px-1 text-xl font-semibold text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <button onClick={() => getDepth(pair, "bid")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Bid
          </button>
          <button onClick={() => getDepth(pair, "ask")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Ask
          </button>
          <button onClick={getOrderBook} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              View Order Book
          </button>
      </div>

        {bid != "" &&
        <div className='mt-4'>
          <p className=''>Bid: {pairBid} {bid}</p>
        </div>
        }
        {ask != "" &&
        <div className='mt-4'>
          <p className=''>Ask: {pairAsk} {ask}</p>
        </div>
        }

        {(bidList.length > 0 && askList.length > 0) &&
        <>
          <p className='mt-4'>ORDER BOOK:</p>
          <div className='mt-4'>
            <p className='mb-2'>10st Bids:</p>
            {bidList.map((crypto) => (
              <div className='' key={crypto}>
                <p className=''>{crypto}</p>
              </div>
            ))}
          </div>
          <div className='mt-4'>
            <p className='mb-2'>10st Asks:</p>
            {askList.map((ask) => (
              <div className='' key={uuidv4()}>
                <p className=''>{ask}</p>
              </div>
            ))}
          </div>
        </>
        }

       {cryptoList.length > 0 &&
        <div className='mt-4'>
          <p className='mb-2'>There are {cryptoList.length} crypto listed on Coinbase Pro:</p>
          {cryptoList.map((bit) => (
            <div className='text-center' key={uuidv4()}>
              <p className='text-center'>{bit}</p>
            </div>
          ))}
        </div>
        }

    </div>
  );
}

export default Page1;
