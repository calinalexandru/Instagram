import React, { useState, useEffect } from "react";
import axios from "axios";
import classes from "./Search.module.css";
import { db, auth } from "../Firebase/Firebase";
import { Dropdown, ListGroup, ListGroupItem } from "react-bootstrap";
const Search = (props) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (search.length > 0) {
      fetch(
        "https://instaclone-77c8f-default-rtdb.firebaseio.com/usernames.json"
      )
        .then((res) => res.json())
        .then((resData) => {
          let searchQuery = search.trim().toLowerCase();
          for (const key in resData) {
            let username = resData[key].toLowerCase();
            if (username.indexOf(searchQuery) !== -1) {
              setUsers(prevResult => {
                return [...prevResult, resData[key]]
              })
            }
          }
        })
        .catch(err => console.log(err));
    }
    else {
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
          />
          <input
            className={classes.searchInput}
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          ></input>
        </div>
      </div>
      <ListGroup
        style={{
          position: "absolute",
          width: "15%",
          right: "0",
          left: "0",
          margin: "0 auto",
          height: "10rem",
          overflowY: "scroll",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
        }}
      >
        {users.map((user) => (
          <ListGroupItem
            style={{ position: "relative", height: "3rem", zIndex: "99999" }}
          >
            <img
              src={user.avatarURL}
              style={{
                height: "25px",
                width: "25px",
                borderRadius: "100%",
                marginRight: "0.6rem",
              }}
            />
            {user.username}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default Search;
