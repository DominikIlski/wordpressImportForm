import React, { useState, /*useEffect*/ } from 'react';
//import logo from './logo.svg';
import './App.css';



const App = () => {
  const [flotiqApiKey, setFlotiqApiKey] = useState('');
  const [wordpressUrl, SetWordpressUrl] = useState('');
  const submit = () => {
    console.log('Button pressed')
    console.log("Flotiq API Key: " + flotiqApiKey)
    console.log("Wordpress URL:  " + wordpressUrl)

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        flotiqApiKey:  flotiqApiKey ,
        wordpressUrl:  wordpressUrl 
      })
    }

    console.log(requestOptions)
    fetch('http://127.0.0.1:3000/hello', requestOptions)
    .then(console.log('-------------------response-----------------'))    
    .then(res => console.log(res.json()))
  }
  /*
  {
      "flotiqApiKey": "26f841d43814d82c01c885b899fb475b",
      "wordpressUrl": "https://wordpress-mysql.dev.cdwv.pl/"
  }
  */

  return (
    <div>
      <h1>Flotiq WordPress importer!</h1>
      <form onSubmit={submit} >
        <label>
          <h3>Flotiq Read and Write API Key:</h3>
          <input type="text" value={flotiqApiKey}
            onChange={(event) => setFlotiqApiKey(event.target.value)} />

        </label>
        <br />
        <label>
          <h3>WordPress full URL:</h3>
          <input type="text" value={wordpressUrl}
            onChange={(event) => SetWordpressUrl(event.target.value)} />

        </label>
        <br />
        <input type="button" value="Import to Flotiq" onClick={submit} />

      </form>
    </div>
  );
}

export default App;
