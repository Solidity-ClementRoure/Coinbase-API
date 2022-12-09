import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { database } from 'firebase-functions/v1/firestore';

function App() {

  const [cryptoList, setCryptoList] = useState<string[]>([])

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

  return (
    <div className="App mt-8">
      
      <button onClick={listCrypto} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
        Crypto List
      </button>

        {cryptoList.map((crypto) => (
          <div className='' key={crypto}>
            <p className=''>{crypto}</p>
          </div>
        ))}

    </div>
  );
}

export default App;
