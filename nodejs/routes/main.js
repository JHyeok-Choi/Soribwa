const express = require('express')
const bodyParser = require('body-parser')

const mysql = require('mysql2')
require('dotenv').config({ path: "../.env" });
const request = require('request')
const axios = require('axios');
const multer = require("multer");
const cors = require("cors");

const { Blob } = require("buffer");
var FormData = require('form-data');
const fs = require('fs');

const { v5: uuidv5 } = require('uuid');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const bcryptjs = require("bcryptjs");
const path = require('path');
const nodemailer = require("nodemailer")

const transporter = require('./transporter');
const { resourceLimits } = require('worker_threads');




const storage = multer.memoryStorage({
})

const upload = multer({
    storage: storage
})


const app = express()
const router = express.Router({});
app.use(cors({
    origin: 'https://www.soribwa.com',
    credentials: true
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());


app.get('/', async (_req, res, _next) => {

    const healthcheck = {
        message: 'OK',
    };
    try {
        res.writeHead(200, {"Content-Type": "text/html"})
        res.write("Health Check OK")
        res.end();
    } catch (error) {
        healthcheck.message = error;
        res.status(503).send();
    }
});



var connection = mysql.createConnection({
    connectionLimit: 10,
    host: process.env.host,
    user: process.env.user,
    port: process.env.port,
    password: process.env.password,
    database: process.env.database,
});

    



app.get('/getimg', (req, res) => {
    const sql = 'select * from user_info';
    connection.query(sql, (err, result) => {
        if(err) return res.json("Error");
        return res.json(result);
    })
})


// login
app.post('/user', async (req, res) => {
    const SecretKey = process.env.JWT_SECRETKEY;
    const RefreshSecretKey = process.env.JWT_REFRESH_SECRETKEY;
    const useremail = req.body.email
    const user = { name: useremail }

    // jwt: payload + secretKey (+ encodingType = asymmetric key? using RS256) 
    const accessToken = jwt.sign(user, SecretKey, { expiresIn: '30s' });//, { algorithm: 'RS256' }); // generate token
    
    const refreshToken = jwt.sign(user, RefreshSecretKey, { expiresIn: '1d' });

    refreshTokens.push(refreshToken);

    res.cookie('jwt', refreshToken, {
        httpOnly: true,  // XSS Cross Site Scripting
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: true,
    })

    const new_password = await bcryptjs.hash(req.body.password, 12)
    connection.query("select * from user_info where email=? and role=?", [req.body.email, "user"], async function(err, results, fields){
        try{
            const anew_password = await bcryptjs.compare(req.body.password, results[0].password)
            if (anew_password) {
                data = {
                    uuid:results[0].uuid,
                    email:results[0].email,
                    name:results[0].name,
                    role:results[0].role,
                    user_avatar:results[0].user_avatar,
                    accessToken: accessToken
                }
                console.log("check data: ", data)
                res.json({"status": 200, "data": data})
            } else {
                res.json({"status": 400, "message": "비밀번호가 일치하지 않습니다."});
            }
        } catch {
            res.json({"status": 400, "message": "일치하는 이메일이 없습니다."})
        }
})});

// register
app.post('/register', async (req, res) => {

    const uuid = uuidv5(`${req.body.email}${req.body.role}`, uuidv5.DNS);

    const new_password = await bcryptjs.hash(req.body.password, 12)

    connection.query("select * from user_info where email=? role=?", [req.body.email, req.body.role], function(err, results, fields){
        console.log(results);
        var role = 'user'
        console.log('role', req.body.role)

        if (results && results.length !== 0) {
            res.json({"status": 400, "data": "Data Duplicate"})
        } else {
            if (req.body.role) {
                var role = req.body.role;
            }

            connection.query("insert IGNORE into user_info values (?, ?, ?, ?, ?, ?, ?)",
                [uuid.toString(), req.body.email, new_password, req.body.name, role, "", req.body.user_avatar],
                function(err0, results0, fields0){
                    if (results0) {
                        results0['uuid'] = uuid.toString();
                        console.log('regi check: ', results0)
                        res.json({"status": 200, "data": results0})

                    } else {
                        res.json({"statu": 400});
                    }
            });
        }
    })

    console.log("\nData Input Success!");
})

// update
app.post('/update', (req, res) => {
    console.log(req.body.email, req.body.name, req.body.password);
    result = connection.query("update user_info set name=? and user_avartar=? where email=?", [req.name, req.file, req.body.email]);
    res.json({"code": 200});
})

// delete
app.post('/delete', (req, res) => {
    console.log(req.body.email);
    result = connection.query("delete from user_info where email=?", [req.body.email]);
    res.json({"code": 200});
})

// logout
app.post('/logout', (req, res) => {
    console.log("logout data receive: ", req.body.name);
    result = connection.query("select * from user_info where name=?", [req.body.name]);
    console.log(result)
    if (result.length != 0) {
        console.log("logout success check: ", req.body.name);
        res.json({"code": 200});
    } else {
        console.log("logout fail check: ", req.body.name);
        res.json({"code": 300});
    }

})

app.post('/audio_test', upload.single("file"), async (req, res) => {
    const formData = new FormData();
    formData.append("file", req.file.buffer, { filename: req.file.originalname });

    await axios.post('http://ec2-15-165-71-22.ap-northeast-2.compute.amazonaws.com:5400/node_test', formData, {
    })
    .then(function (result) {
        res.json(result.data)
    }).catch(function (error) {
        console.log(error)
    })
})



var client_id = process.env.REACT_APP_NAVER_CLIENT_ID;
var client_secret = process.env.REACT_APP_NAVER_CLIENT_SECRET;
var state = "true";
var redirectURI = encodeURI(process.env.REACT_APP_NAVER_REDIRECT_URI);
var api_url = "";
const encodeBody = "";
const url = process.env.REACT_APP_REGISTER_URI;
const social_uri = process.env.REACT_APP_SOCIAL_LOGIN


app.get('/callback', async function (req, res) {
    code = req.query.code;
    console.log('ccc: ', code)
    state = req.query.state;
    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
     + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
    var request = require('request');
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
     console.log("node check1")

         var option = {
             url: 'https://openapi.naver.com/v1/nid/me',
             headers: {'Authorization': `Bearer ${JSON.parse(req.body).access_token}`
             }
         }
         console.log("option check", option)

        await request.get(option, async function (error1, response1, body1) {
            if (!error1 && response1.statusCode == 200) {

                let encodeBody = JSON.parse(body1);
    
                data = { 
                    "email": encodeBody.response.id,
                    "password":"password",
                    "name": encodeBody.response.nickname,
                    "role": "naver",
                    "user_avatar": encodeBody.response.profile_image
                }
                
                await axios({method: 'POST', url, data, headers:{
                    'Content-Type': 'application/json; charset=utf-8'
                }}).then((response3) => {
                    console.log(`statusCode: ${response3.status}`)
                    console.log(response3.data)
                    let encodeBody = JSON.parse(body1);
                    res.redirect(`${social_uri}?id=${encodeBody.response.id}&nickname=${encodeBody.response.nickname}&img=${encodeBody.response.profile_image}&role=naver&uuid=${response3.data.data.uuid}`)
                }).catch((error3) => {
                    console.error(error3)
                })



            } else {
                console.log('error1 = ' + response1.statusCode);
            }
        })
  });



app.get('/kakaoCallback', async function (req, res) {
    code = req.query.code;
    console.log('ad',code)


    const headers = {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    };
    console.log(headers)
    const payload = {
        grant_type: 'authorization_code',
        client_id: process.env.REACT_APP_KAKAO_REST_API,
        redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
        code,
    };
    console.log(payload)
    try {
        const res0 = await axios({method: 'POST', headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',}, 
            url:'https://kauth.kakao.com/oauth/token',
        data: payload});
        console.log("res 1: ", res0)

        try {
            const res1 = await axios({
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${res0.data.access_token}`
                },
                url: "https://kapi.kakao.com/v2/user/me",
            })
            console.log("res 2: ", res1)
            if (res1.data.kakao_account.is_email_verified){
                console.log("kakao verified")

                profile_image = res1.data.properties.thumbnail_image.replace("http", "https")

                try {
                    data = { 
                        "email": res1.data.kakao_account.email,  
                        "password":"password",
                        "name": res1.data.properties.nickname,
                        "role": "kakao",
                        "user_avatar": profile_image
                    }
                    
                    await axios({method: 'POST', url, data, headers:{
                        'Content-Type': 'application/json; charset=utf-8'
                    }}).then((response3) => {
                        console.log(`statusCode: ${response3.status}`)
                        console.log(response3.data)
                        res.redirect(`${social_uri}?id=${res1.data.kakao_account.email}&nickname=${res1.data.properties.nickname}&img=${profile_image}&role=kakao&uuid=${response3.data.data.uuid}`)
                    }).catch((error3) => {
                        console.error(error3)
                    })
                } catch (erer) {
                    console.log(erer)
                }
            }
        } catch (err) {
            console.log("auth get")
            console.log(err);
        }
        //navigate("/App");
    } catch (err) {
        console.log("token post")
        console.log(err);
    }
})


app.get('/googleCallback', async function (req, res) {
    code = req.query.code;
    console.log('ad',code)


    const headers = {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    };
    console.log(headers)
    const payload = {
        grant_type: 'authorization_code',
        client_id: process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID,
        client_secret: process.env.REACT_APP_GOOGLE_AUTH_CLIENT_PASSWORD,
        redirect_uri: process.env.REACT_APP_GOOGLE_AUTH_CALLBACK_URI,
        code,
    };
    console.log(payload)
    try {
        const res0 = await axios({method: 'POST', headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',}, 
            url:'https://oauth2.googleapis.com/token',
        data: payload});
        console.log("res 1: ", res0)

        try {
            const res1 = await axios({
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${res0.data.access_token}`
                },
                url: "https://www.googleapis.com/oauth2/v2/userinfo",
            })
            console.log("res 2: ", res1)
            if (res1.data.verified_email){
                console.log("kakao verified")

                try {
                    data = { 
                        "email": res1.data.email,  // 차후 자릿수나 소셜 유저 롤 넣어서 변경해야함.
                        "password": "password",
                        "name": res1.data.name,
                        "role": "google",
                        "user_avatar": res1.data.picture
                    } 
                    
                    await axios({method: 'POST', url, data, headers:{
                        'Content-Type': 'application/json; charset=utf-8'
                    }}).then((response3) => {
                        console.log(`statusCode: ${response3.status}`)
                        console.log('google : ', response3.data.data.uuid)
                        res.redirect(`${social_uri}?id=${res1.data.email}&nickname=${res1.data.name}&img=${res1.data.picture}&role=google&uuid=${response3.data.data.uuid}`)
                    }).catch((error3) => {
                        console.error(error3)
                    })
                } catch (erer) {
                    console.log(erer)
                }
            }
        } catch (err) {
            console.log("auth get")
            console.log(err);
        }
    } catch (err) {
        console.log("token post")
        console.log(err);
    }
})


app.get('/healthCheck', (_req, res) => {
    try {
        res.writeHead(200, {"Content-Type": "text/html"})
        res.write("Health Check OK")
        console.log("Healthy")
        res.end();
    } catch (error) {
        healthcheck.message = error;
        res.status(503).send();
    }
});



app.post("/email", async(req,res) => {

    
    const emailValue = req.body.email
    console.log("email check: ", emailValue)
    
    const result = {
        "status": null,
        "message": null,
        "code": null
    }
    
    // Rules  //  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;  &  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
    const emailRule = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    

    try {
        
        if (emailValue === null || emailValue === undefined || emailValue === "" || emailValue === "@") {
            result.status = 401
            result.message = "이메일 값이 올바르지 않습니다."
            return res.send(result)
        } else if (!emailRule.test(emailValue)){
            result.status = 401
            result.message = "이메일 양식이 올바르지 않습니다."
            return res.send(result)
        }
    
        
        var connection = mysql.createConnection({
            connectionLimit: 10,
            host: process.env.host,
            user: process.env.user,
            port: process.env.port,
            password: process.env.password,
            database: process.env.database,
        });
        const [rows] = await connection.promise().query("select * from user_info where email = ? and role = ?", [req.body.email, "user"])
        
        if(rows.length !== 0){
            result.status = 401
            result.message = "중복된 메일입니다."
            return res.send(result)
        }else{
            const random_code = Math.floor(Math.random() * 1000000)// 6자기 인증코드 랜덤 추출
            transporter.sendMail({
                from: process.env.NAVER_USER ,//인증코드 발급자 이메일 
                to: emailValue,// 인증코드 받을 이메일 주소
                subject: 'Soribwa 회원가입 인증코드 안내',
                html: `
                    <html lang="kr">
                    <body>
                        <div>
                            <div style="margin-top: 30px;">
                                <p style="font-size: 14px; color: #222222;"> 안녕하세요. Soribwa 입니다. </p>
                                <h3 style="font-size: 20px;"> [${random_code}] </h3>
                                <p style="font-size: 14px; color: #222222;"> 해당 숫자를 홈페이지에서 입력하셔야 </p>
                                <p style="font-size: 14px; color: #222222;"> 서비스를 이용하실 수 있습니다.  </p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            })
            result.status = 200
            result.code = random_code 
            return res.send(result)
        }
    
    } catch(e) {
        result.status = 500
        result.message = e.message
        return res.send(result)
    }
    
})
let refreshTokens = []


// login
app.post('/token', (req, res) => {
    const SecretKey = process.env.JWT_SECRETKEY;
    const RefreshSecretKey = process.env.JWT_REFRESH_SECRETKEY;
    const username = req.body.name
    const user = { name: username }

    // jwt: payload + secretKey (+ encodingType = asymmetric key? using RS256) 
    const accessToken = jwt.sign(user, SecretKey, { expiresIn: '30s' });//, { algorithm: 'RS256' }); // generate token
    
    const refreshToken = jwt.sign(user, RefreshSecretKey, { expiresIn: '1d' });

    refreshTokens.push(refreshToken);

    res.cookie('jwt', refreshToken, {
        httpOnly: true,  // XSS Cross Site Scripting
        maxAge: 24 * 60 * 60 * 1000,
    })

    res.json({ accessToken: accessToken })
})



function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

        // jwt.sign을 jwt.verify로 정보 받아오기.
        jwt.verify(token, process.env.JWT_SECRETKEY, (err, user) => {
            console.log(err)
            if (err) return res.sendStatus(403)
            req.user = user
            next() // next()를 이용해 다음으로 이동함.
        })
}

// req.cookies => Cookie-Parser 모듈 필요. npm install cookie-parser, app.use(cookieParser());
// refreshToken은 cookie에 담겨있기에 쿠키에서 가져오게 됨.
// 원래는 데이터베이스에서 refreshToken을 찾아야하지만,
// 현재 메모리에 refreshToken을 넣어놔서 메모리에서 같은게 있는지 찾기
// refreshToken을 verify한 후에 유효한 것이라면 다시 accessToken을 생성해서 json으로 보내줌.

app.get('/refresh', (req, res) => {
    const cookies = req.cookies;
    console.log("check cookies: ", cookies.jwt)
    if (!cookies?.jwt) return res.sendStatus(401);
    
    const refreshToken = cookies.jwt;
    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403)
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRETKEY, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign({ name: user.name },
            process.env.JWT_SECRETKEY, { expiresIn: '30s' });
        res.json({ accessToken });
    })
})


module.exports = app;