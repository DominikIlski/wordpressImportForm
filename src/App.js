import React, { useState } from "react";
//import Spinner from "react-bootstrap/Spinner";

import "./App.css";
import styles from "./app.module.css";
import { CircularProgress } from "@material-ui/core";
const randomWords = require("random-words");

const WP_IMPORT_AUTH =
  "https://q0lnm6ubn4.execute-api.us-east-1.amazonaws.com/default/wordpressimportauth";
const WP_IMPORT_STATUS =
  "https://4nkqkd9vc2.execute-api.us-east-1.amazonaws.com/default/wordpressImporterStatus?userRequestCode=";

const timestamp = new Date();
let interval = setInterval(() => {}, 1000000000);

const checkStatus = async (userRequestCode) => {
  let responseBody;
  const requestOptions = {
    method: "GET",
  };
  console.log("status check");
  console.log(userRequestCode);

  const statusRequest = await fetch(
    WP_IMPORT_STATUS + userRequestCode,
    requestOptions
  );
  console.log(statusRequest);
  responseBody = await statusRequest.json();
  console.log(responseBody);

  if (responseBody.Item) return responseBody.Item.status.S;
  else return "There is no import with that request code";
};

const UcFirst = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

console.log(timestamp.toISOString());
const requestCodeGenerator = () => {
  const date = timestamp.toISOString().split("T")[0];
  const word1 = UcFirst(randomWords());
  const word2 = UcFirst(randomWords());

  return word1 + word2 + date;
};

const App = () => {
  const [flotiqApiKey, setFlotiqApiKey] = useState(
    "5019d7f9b7968409d745e08e201c77d4"
  );
  const [wordpressUrl, SetWordpressUrl] = useState(
    "https://wordpress-mysql.dev.cdwv.pl/"
  );
  const [progress, SetProgress] = useState("none");
  const [userRequestCode, SetUserRequestCode] = useState("");
  const [isFetching, SetIsFetching] = useState(false);
  console.log("init of state");
  console.log(userRequestCode);
  console.log(isFetching);
  if (progress === "success") clearInterval(interval);

  const submit = async () => {
    SetIsFetching(true);
    clearInterval(interval);
    const userCode = requestCodeGenerator();
    console.log(userCode);
    SetUserRequestCode(userCode);
    SetUserRequestCode(userCode);

    console.log(userCode);

    const url =
      WP_IMPORT_AUTH +
      `?userRequestCode=${userCode}` +
      `&flotiqApiKey=${flotiqApiKey}` +
      `&wordpressUrl=${wordpressUrl}`;

    const requestOptions = {
      method: "GET",
    };

    console.log(requestOptions);
    const res = await fetch(url, requestOptions);
    if (res.status !== 200) SetProgress("error");
    if (res.status === 200) SetProgress(await checkStatus(userCode));
    SetIsFetching(false);

    interval = setInterval(async () => {
      SetIsFetching(true);
      SetProgress(await checkStatus(userCode));
      SetIsFetching(false);
    }, 5000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <h1>Flotiq WordPress importer!</h1>
        <form onSubmit={async () => await submit()}>
          <label>
            <h3>Flotiq Read and Write API Key:</h3>
            <input
              className={styles.input}
              type="text"
              value={flotiqApiKey}
              onChange={(event) => setFlotiqApiKey(event.target.value)}
            />
          </label>
          <br />
          <label>
            <h3>WordPress full URL:</h3>
            <input
              className={styles.input}
              type="text"
              value={wordpressUrl}
              onChange={(event) => SetWordpressUrl(event.target.value)}
            />
          </label>
          <br />
          <input type="button" value="Import to Flotiq" onClick={submit} />
        </form>
      </div>
      <div className={styles.vl}></div>
      <div className={styles.column}>
        <h2>Your individual request code: </h2>
        <input
          className={styles.input}
          type="text"
          value={userRequestCode}
          onChange={(event) => {
            SetUserRequestCode(event.target.value);
          }}
        ></input>
        <br />
        <button
          onClick={async () => {
            SetIsFetching(true);
            SetProgress(await checkStatus(userRequestCode));
            SetIsFetching(false);
          }}
        >
          Check status
        </button>
      </div>
      <div className={styles.vl}></div>
      {isFetching === true ? (
        <div className={styles.centerContent}>
          <CircularProgress size={100} className={styles.spinner} />
          <div className={styles.vl}></div>

        </div>
      ) : progress === "none" ? (
        <div />
      ) : (
        <div className={styles.container}>
          <div className={styles.column}>
            <h2>Server response: </h2>
            <h3>Status Code: {progress}</h3>
          </div>
          <div className={styles.vl}></div>
        </div>
      )}
    </div>
  );
};

export default App;
