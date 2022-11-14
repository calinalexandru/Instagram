/*
  This component receives props from Search.js and displays the matched users info - avatar image and username
*/

import React from "react";
import classes from "./ShowSearchedUsers.module.css";
const ShowSearchedUsers = (props) => {
  return (
    <div className={classes.userListContainer}>
      {props.users.map((user) => {
        console.log(user[0]);
        return (
          <div className={classes.user} key={user[0]}>
            <img src={user[1]} alt={user[0]}/>
            <div>{user[0]}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ShowSearchedUsers;
