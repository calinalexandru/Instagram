import React from "react";

const Dummy = () => {

  function sendData() {
    let data = {
      avatarURL: "random_url" + Math.random(),
      username: "xyz" + Math.random(),
    };

    fetch(
      "https://instaclone-77c8f-default-rtdb.firebaseio.com/usernames.json",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  return <button onClick={sendData}>Send Data</button>;
};

export default Dummy;
