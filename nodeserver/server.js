const express=require('express');
const app=express();
require('dotenv').config();
const con=require('./config/db');
const account=require('./Routes/Account');
const blog=require('./Routes/Blog');

app.use(require('cors')());
app.use(express.json());

app.use('/api/blog/account',account);
app.use('/api/blog',blog);

const PORT=process.env.PORT;

(async()=>{
    await con();
    app.listen(PORT,console.log(`Listening on port ${PORT}`));
})();