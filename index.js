const express = require('express');
const app = express();
const dateInfo = require('./date_time_et');

app.set('view engine', 'ejs');
app.use(express.static('public'));

//route
app.get('/', (req, res)=>{
	//res.send("See töötab!");
	res.render('index');
});

app.get('/timenow', (req, res)=>{
	const dateNow = dateInfo.dateNowET();
	const timeNow = dateInfo.timeNowET();
	res.render('timenow', {dateNow: dateNow, timeNow: timeNow});
});

app.get('/test', (req, res)=>{
	res.send("Test on edukas!");
});

app.get('/wisdom', (req, res)=>{ 
	let folkWisdom = [];
	fs.readFile("txtfiles/vanasonad.txt", "utf8", (err, data)=>{
		if(err) {
			console.log(err);
		}
		else {
			folkWisdom = data.split(";");
			res.render('justlist', {h1: 'Vanasõnad', wisdoms: folkWisdom});
		}
	});
});

app.listen(5214);