const http = require("http");
const path = require("path");
const url = require("url");
const fs = require("fs");
const querystring = require('querystring');
const dateInfo = require("./date_time_et");
const pageHead = '<!DOCTYPE html>\n<html><head><meta charset="utf-8">\n\<title>Marina Kuznetsova, veebiprogrammeerimine 2023</title></head> <body>';
const pageBanner = '\n\t<img src="banner.png" alt="Lehe bänner">\n';
const pageBody = '<h1>Marina Kuznetsova</h1><p>See leht on loodud <a href="https://www.tlu.ee" target="_blank">TLÜ</a> Digitehnoloogiate instituudis õppetöö raames!</p><p>Ma õpin informaatikat Tallinna Ülikoolis</p><p>Vabal ajal mulle meeldib puhata kodus</p><hr><p>Kursus, mille raames leht tehti on: veebiprogrammeerimine.</p></body></html>'
const pageFoot = '\n</body>\n</html>';

http.createServer(function(req, res){
	if (req.method === 'POST'){
		//res.end('Tuligi POST!');
		/* collectRequestData(req, result => {
			res.write(result);
			res.end();
		});
		//avan tekstifaili kirjutamiseks nii,et kui seda olemas pole, luuakse
		fs.open('public/log.txt', 'a', (err, file)=>{
			if(err){
				throw err;
			}
			else {
				fs.appendFile('public/log.txt', 'Tekst lisatud;', (err)=>{ */
				
		collectRequestData(req, result => {
			//console.log(result);
			let notice = '<p>Sisestatud andmetega tehti midagi!</p>';
			//kirjutame andmeid tekstifaili
			fs.open('public/log.txt', 'a', (err, file)=>{
				if(err){
					throw err;
					nameAddedNotice(res, notice);
				}
				else {
					//kirjutame faili saadud eesnime ja semikooloni
					fs.appendFile('public/log.txt', result.nameInput + ',' + result.lastNameInput + ',' + dateInfo.dateNowENShort() + ';', (err)=>{
						if(err){
							throw err;
							notice = '<p>Sisestatud andmete salvestamine ebaõnnestus!</p>';
							nameAddedNotice(rs, notice);
						}
						else {
							console.log('faili kirjutati!');
							notice = '<p>Sisestatud andmete salvestamine õnnestus!</p>';
							nameAddedNotice(res, notice);
						}
					});
				}
					if(err){
						throw err;
					}
			});
		});	
	}
	else {
		//console.log(url.parse(req.url, true));	
		let currentURL = url.parse(req.url, true);
		if(currentURL.pathname === "/"){
			//määrame tagastatavate vandmete paise,et on veebileht
			res.writeHead(200, {"Content-Type": "text/html"});
			res.write(pageHead);
			res.write(pageBanner);
			res.write(pageBody);
			res.write('\n\t <p>Lehe avamise hetkel oli:' + dateInfo.dateNowET() + ' kell ' + dateInfo.timeNowET() + '</P>');
			res.write('\n\t <p><a href="addName">Lisame nime!</a>!</p>');
			res.write('\n\t <p><a href="listNames">Sisestatud nimed</a>!</p>');
			res.write('\n\t <p>Semestri <a href="semesterprogress">edenemine</a>.</p>');
			res.write('\n\t <p>TLÜ <a href="photos">foto</a>.</p>');
			res.write(pageFoot);
			//et see koik valmiks ja ara saadetaks
			return res.end();
		} 
		else if (currentURL.pathname === "/addName"){
			res.writeHead(200, {"Content-Type": "text/html"});
			res.write(pageHead);
			res.write(pageBanner);
			res.write(pageBody);
			res.write('\n\t<h2>Palun lisa oma nimi</h2>');
			res.write('\n\t<form method="POST">\n\t\t<label for="nameInput">Eesnimi: </label>\n\t\t<input type="text" id="nameInput" name="nameInput" placeholder="Sinu eesnimi...">\n\t\t<br>\n\t\t<label for="lastNameInput">Perekonnanimi: </label>\n\t\t<input type="text" id="lastNameInput" name="lastNameInput" placeholder="Sinu perekonnanimi...">\n\t\t<input type="submit" name="nameSubmit" value="Salvesta">\n\t</form>');
			res.write('\n\t <p><a href="/">Tagasi avalehele</a>!</p>');
			res.write(pageFoot);
			//et see koik valmiks ja ara saadetaks
			return res.end();
		}
		else if (currentURL.pathname === "/listNames"){
			let htmlOutput = '\n\t<p>Kahjuks ühtegi nime ei leitud</p>';
			fs.readFile("public/log.txt", "utf8", (err, data)=>{
				if(err){
					console.log(err);
					listAllNames(res, htmlOutput);
				}
				else {
					//console.log(data);
					let allData = data.split(";");
					let allNames = [];
					htmlOutput = '\n\t<ul>';
					for (person of allData){
						allNames.push(person.split(',')); 
					}
					//console.log(allNames);
					for (person of allNames){
						if(person[0]){
							htmlOutput += '\n\t\t<li>' + person[0] + ' ' + person[1] + ', salvestatud: ' + person[2] + '</li>';
						}
					}
					htmlOutput += '\n\t</ul>'
					listAllNames(res, htmlOutput);
				}
			});
		}
		
		else if (currentURL.pathname === "/semesterprogress"){
			res.writeHead(200, {"Content-Type": "text/html"});
			res.write(pageHead);
			res.write(pageBanner);
			res.write(pageBody);
			res.write('\n\t<hr>');
			res.write(semesterInfo());
			res.write('\n\t <p><a href="/">Tagasi avalehele</a>!</p>');
			res.write(pageFoot);
			//et see kõik valmiks ja ära saadetaks
			return res.end();
		}
			
		else if (currentURL.pathname === "/photos"){
			let htmlOutput = '\n\t<p>Pilti ei saa näidata!</p>';
			//loen fotode nimekirja
			fs.readdir('public/photos', (err, fileList)=>{
				if(err) {
					throw err;
					tluPhotoPage(res, htmlOutput);
				}
				else {
					//console.log(fileList.length);
					let photoNum = Math.floor(Math.random() * fileList.length);
					//console.log(photoNum);
					//console.log('\n\t <img src="' + fileList[photoNum] + '" alt="TLÜ pilt">');
					htmlOutput = '\n\t <img src="' + fileList[photoNum] + '" alt="TLÜ pilt">';
					tluPhotoPage(res, htmlOutput);
				}
					
			});
				
		}
		else if (currentURL.pathname === "/banner.png"){
			console.log("Tahan pilti!");
			let filePath = path.join(__dirname, "public", "banner/vp_banner_2023.png");
			fs.readFile(filePath, (err, data)=>{
				if(err){
					throw err;
				}
				else {
					res.writeHead(200, {"Content-type": "image/png"});
					res.end(data);
				}
			});
		}
		//else if (currentURL.pathname === "/tlu_42.jpg"){
		else if (path.extname(currentURL.pathname) === '.jpg'){
			console.log(path.extname(currentURL.pathname));
			console.log("Tahan jpg pilti!");
			let filePath = path.join(__dirname, 'public', 'photos');
			fs.readFile(filePath + currentURL.pathname, (err, data)=>{
				if(err){
					throw err;
				}
				else {
					res.writeHead(200, {"Content-Type": "image/jpeg"});
					res.end(data);
				}
			});
		}
			
		else{
			res.end('ERROR 404');
		}
			
	}	
}).listen(5214);
	
	function semesterInfo(){
		let htmlOutput = '<p>Info puudub!</p>';
		const semesterBegin = new Date("08/28/2023");
		//const semesterBegin = new Date("10/05/2023");
		const semesterEnd = new Date("01/28/2024");
		//const semesterEnd = new Date("10/01/2023");
		const today = new Date();
		if(today < semesterBegin){
			htmlOutput = '<p>2023/2024 õppeaasta sügissemester pole veel alanud!</p>';
		}
		else if (today > semesterEnd){
			htmlOutput = '<p>2023/2024 õppeaasta sügissemester on juba möödas!</p>';
		}
		else {
			const semesterDuration = Math.floor((semesterEnd.getTime() - semesterBegin.getTime()) / 1000 * 60 * 60 * 24);
			const semesterLastedFor = Math.floor((today.getTime() - semesterBegin.getTime()) / (1000 * 60 * 60 * 24));
			htmlOutput = '<p>2023/2024 õppeaasta sügissemester on kestnud juba ' + semesterLastedFor + ' päeva!</p>';
			htmlOutput += '\n\t <meter min="0" max="' + semesterDuration + '"value="' + semesterLastedFor + '"></meter>';
		}
		return '\n\t' + htmlOutput;
	}

	function tluPhotoPage(res, photoHTML){
			//console.log(photoHTML)
			res.writeHead(200, {"Content-Type": "text/html"});
			res.write(pageHead);
			res.write(pageBanner);
			res.write(pageBody);
			res.write('\n\t<hr>');
			res.write(photoHTML);
			//res.write('\n\t<img src="tlu_42.jpg" alt=TLÜ foto">');
			res.write('\n\t <p><a href="/">Tagasi avalehele</a>!</p>');
			res.write(pageFoot);
			//et see kõik valmiks ja ära saadetaks
		
			request.on('end', () => {
				console.log(receivedData);
				callback(parse(receivedData));
				callback(querystring.decode(receivedData));
			});
		}
		else {
			callback(null);
		}
		
	}
	
	function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] === FORM_URLENCODED) {
        let receivedData = '';
        request.on('data', chunk => {
            console.log(chunk);
            receivedData += chunk.toString();
        });
        request.on('end', () => {
            console.log(receivedData);
            callback(querystring.decode(receivedData));
        });
    } else {
        callback(null);
    }
}

function nameAddedNotice(res, notice){
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(pageHead);
	res.write(pageBanner);
	res.write(pageBody);
	res.write('\n\t<h2>Palun lisa oma nimi</h2>');
	res.write('\n\t' + notice);
	res.write('\n\t <p><a href="/addName">Sisestame järgmise nime</a>!</p>');
	res.write('\n\t <p><a href="/">Tagasi avalehele</a>!</p>');
	res.write(pageFoot);
	//et see kõik valmiks ja ära saadetaks
	return res.end();
}

function listAllNames(res, htmlOutput){
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(pageHead);
	res.write(pageBanner);
	res.write(pageBody);
	res.write('\n\t<h2>Kõik sisestatud nimed</h2>');
	res.write(htmlOutput);
	res.write('\n\t <p><a href="/">Tagasi avalehele</a>!</p>');
	res.write(pageFoot);
	//et see kõik valmiks ja ära saadetaks
	return res.end();
}


//5200 Rinde
//5214 Marina
//http://greeny.cs.tlu.ee:5214/





