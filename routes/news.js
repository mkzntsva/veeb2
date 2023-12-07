const express = require('express');
// loome marsruutimise miniäpi
const router = express.Router(); //suur 'R' on oluline!!

//kuna siin on kasutusel miniäpp router, ss kõik marsruudid on router'il mitte äpp'il
// kuna kõik siinsed marsruudid algavad osaga '/news', siis neda pole vaja kirjutada

router.get('/', (req, res)=> {
	res.render('news');
});

router.get('/add' (req, res)=> {
	res.render('addnews');
});

router.post('/add'. (req, res)=> {
	if(!req.body.titleInput || !req.body.contentInput || !req.body.expireDateInput){
		console.log('Uudisega jama');
		notice = 'Andmeid puudu!';
		res.render('addnews', (notice: notice));
	}
	else {
		let sql = 'INSERT INTO vp_news (title, content, expire, userid) VALUES(?,?,?,?)'
	}