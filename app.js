const express = require('express');

const app = express();

app.set('view engine', 'ejs')

app.get('/', (req, res)=>{
    var today = new Date;
    if(today.getDate() === 6 || today.getDate() === 0) {
        res.send('<h1>welcome to the weekend!</h1>')
    }
    else {
        res.send('<h1>oh no! slog through the week then!</h1>')
    }
})

app.listen(3000, ()=>{
    console.log('server running on port 3000');
})