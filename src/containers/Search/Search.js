import React, { useState, useEffect } from "react";
import classes from "./Search.module.css";
import ShowSearchedUsers from "../ShowSearchedUsers/ShowSearchedUsers";

const Search = (props) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (search.length > 0) {
      let usersList = [];

      fetch(
        "https://instaclone-77c8f-default-rtdb.firebaseio.com/usernames.json"
      )
        .then((res) => res.json())
        .then((resData) => {
          let searchQuery = search.replace(/\s+/g, "").toLowerCase();
          console.log(searchQuery);
          for (const key in resData) {
            console.log(resData[key]["avatarURL"], resData[key]["username"]);
            let username = resData[key]["username"]
              .replace(/\s+/g, "")
              .toLowerCase();
            if (
              username.indexOf(searchQuery) !== -1 &&
              username.startsWith(searchQuery)
            ) {
              usersList.push([
                resData[key]["username"],
                resData[key]["avatarURL"],
              ]);
            }
          }

          if (usersList) {
            setUsers(usersList);
          } else {
            setUsers([]);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setUsers([]);
    }
  }, [search]);

  return (
    <div>
      <div className={classes.parent}>
        <div className={classes.inputContainer}>
          <img
            className={classes.search}
            src="https://img.icons8.com/ios-glyphs/30/000000/search--v1.png"
            alt="Search"
          />
          <input
            className={classes.searchInput}
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          ></input>
        </div>
      </div>

      {users.length > 0 ? <ShowSearchedUsers users={users} /> : null}
    </div>
  );
};

export default Search;
