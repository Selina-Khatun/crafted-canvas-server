const express=require('express');
const cors =require('cors');
const app=express();
const port =process.eventNames.PORT||5000;
// middleware
app.use(cors());
app.use(express.json());




app.get('/',(req,res)=>{
    res.send('crafted server is running')

})

app.listen(port,()=>{
    console.log(`Crafted server is running on port:${port}`)
})