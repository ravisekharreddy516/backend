const express = require("express");
const router = express.Router();
const db = require("../db");

/* GET all users list. */
router.get("/", function (req, res) {
  db.query("SELECT * FROM users", (err, row) => {
    if (err) {
      res.send({ success: false, message: "Error" });
    } else if (row.length > 0) {
      res.send({ success: true, data: row, message: "Success" });
    } else {
      res.send({ success: false, message: "No data found!" });
    }
  });
});

/* GET signel user details.*/
router.get("/:userid", function (req, res) {
  let userid = req.params.userid;
  db.query("SELECT * FROM users where id=?", [userid], (err, row) => {
    if (err) {
      res.send({ success: false, message: "Error" });
    } else if (row.length > 0) {
      res.send({ success: true, data: row, message: "Success" });
    } else {
      res.send({ success: false, message: "No data found!" });
    }
  });
});

/*Add User*/
router.post("/addUser", function (req, res) {
  const data = req.body;
  const user = {
    email: data.email,
    password: data.password,
  };
  db.query("SELECT * FROM users WHERE email=?", [user.email], (errs, rows) => {
    if (errs) {
      res.send({ success: false, message: errs });
    } else if (rows.length > 0) {
      res.send({
        success: true,
        message: "Already registered with this mail!",
      });
    } else {
      db.query("INSERT INTO users SET ?", [user], (err, result) => {
        if (err) {
          res.send({ success: false, message: err });
        } else {
          res.send({ success: true, message: "Registered Successfully!" });
        }
      });
    }
  });
});

/*Update User*/
router.put("/updateUser/:userid", function (req, res) {
  const userid = req.params.userid;
  const data = req.body;
  // Columns check before updating.
  const columns = ["fullname", "gender", "fav_language"];
  let result = Object.keys(data).map((key) => {
    let output = columns.filter((col) => col === key).length;
    if (output === 0) {
      return false;
    } else {
      return true;
    }
  });
  if (result.filter((val) => val === false).length >= 1) {
    res.send({ success: false, message: "Unknown fields found!" });
  } else {
    // Data check before updating.
    db.query("SELECT * FROM users WHERE id=?", [userid], (errs, rows) => {
      if (errs) {
        res.send({ success: false, message: errs });
      } else if (rows.length > 0) {
        const user = {
          fullname: data.fullname ? data.fullname : rows[0]["fullname"],
          gender: data.gender ? data.gender : rows[0]["gender"],
          fav_language: data.fav_language
            ? data.fav_language
            : rows[0]["fav_language"],
        };
        db.query(
          "UPDATE users SET ? WHERE id=?",
          [user, userid],
          (err, result) => {
            if (err) {
              res.send({ success: false, message: errs });
            } else {
              res.send({
                success: true,
                message: "Updated Profile Successfully!",
              });
            }
          }
        );
      } else {
        res.send({ success: true, message: "User not found!" });
      }
    });
  }
});

/*Delete User*/
router.delete("/deleteUser/:userid", function (req, res) {
  let userid = req.params.userid;
  db.query("DELETE FROM users where id=?", [userid], (err, result) => {
    if (err) {
      res.send({ success: false, message: "Error" });
    } else {
      res.send({ success: false, message: "Deleted Successfully!" });
    }
  });
});

module.exports = router;
