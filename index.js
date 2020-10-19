const bodyParser = require('body-parser');
const mysql = require('mysql');
const express = require('express');
const app =express();


app.use(bodyParser.urlencoded({
    extended : true
}));

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'abc123',
    database : 'workindia'
});


db.connect((err)=>{
    if(err){
        console.log("Error connecting to database", err.sqlMessage);
    }
    else{
        console.log("Database connection successfull");
    }
})

app.post('/app/user', registrationHandler);
app.post('/app/user/auth', loginHandler);


const PORT = process.env.PORT | 4000;

app.listen(PORT,()=>{
    console.log(`Server started on http://localhost:${PORT}`);
})


function registrationHandler(req,res){
    const { username, password } = req.body;

    console.log(username, password);

    if(!username && !password){
        return res.json({
            status: 'Account creation failed',
            message: 'Username and Password are required'
        })
    }

    if(!username){
        return res.json({
            status: 'Account creation failed',
            message: 'Username is required'
        })
    }

    if(!password){
        return res.json({
            status: 'Account creation failed',
            message: 'Password is required'
        })
    }

    const QUERY = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;

    db.query(QUERY, (err, rows, fields)=>{
        console.log(rows, err);
        if(err){
            return res.json({
                status : 'Account creation failed'
            })
        }

        return res.json({
            status : 'Account creation succesfull'
        })
    })
}


function loginHandler(req,res){
    const { username, password } = req.body;

    console.log(username);

    if(!username && !password){
        return res.json({
            status: 'Login failed',
            message: 'Username and Password are required'
        })
    }

    if(!username){
       return res.json({
            status: 'Login failed',
            message: 'Username is required'
        })
    }

    if(!password){
        return res.json({
            status: 'Login failed',
            message: 'Password is required'
        })
    }

    const QUERY = `SELECT users.user_id from users where users.username = '${username}' and users.password = '${password}'`;

    db.query(QUERY, (err, rows, fields)=>{

        if(err){
            return res.json({
                status : 'Login failed'
            })
        }

        return res.json({
            status : 'Login succesfull',
            id : rows[0]['user_id']
        })
    })
}