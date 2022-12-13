const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database.js');
const cors = require('cors');
const genLink = require('./modules/genLink');
const domain = 'http://localhost:3030'
const Short = require('./models/Short.js');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

connection
	.authenticate()

	.then(() => {
		console.log("Successful connection.");
	})

	.catch((errorMsg)=>{
		console.log(errorMsg);
	});

app.get('/:shortlink', async (req,res)=>{
	let {shortlink} = req.params;
	let short = await Short.findOne({where:{shortlink: shortlink}});
	if(!short){
		res.sendStatus(404);
	}else{
		res.status(301).redirect(short.originallink);
	}
});

app.get('/link/short', async (req,res)=>{
	let shorts = await Short.findAll();
	res.status(200);
	res.json(shorts);
});

app.get('/link/short/:id', async (req,res)=>{
	let id = req.params.id;
	if(!isNaN(id)){
		let short = await Short.findByPk(id);
		if(!short){
			res.sendStatus(404);
		}else{
			res.json(short);
		}
	}else{
		res.sendStatus(406);
	}
});

app.post('/link/short', async (req,res)=>{
	let {link} = req.body;
	let created = false;
	while(!created){
		let shortlink = genLink();
		let linkExists = await Short.findOne({where:{shortlink: shortlink}});
		if(!linkExists){
			await Short.create({shortlink: shortlink, originallink: link });
			created = true;
			res.status(201)
			res.json({shortedLink: `${domain}/${shortlink}`});
		}
	}
});

app.put('/link/short/:id', async (req,res)=>{
	let id = req.params.id;
	if(!isNaN(id)){
		let short = await Short.findByPk(id);
		if(!short){
			res.sendStatus(404);
		}else{

			let {link, shortlink} = req.body;

			if(link != undefined){
				await Short.update({originallink: link}, {where:{id: id}});
			}

			if(shortlink != undefined){
				await Short.update({shortlink: shortlink}, {where:{id: id}});
			}

			res.sendStatus(200);
		}
	}else{
		res.sendStatus(406);
	}
});

app.delete('/link/short/:id', async(req,res)=>{
	let id = req.params.id;
	if(!isNaN(id)){
		await Short.destroy({where:{id:id}});
		res.sendStatus(200);
	}else{
		res.sendStatus(406);
	}
})

app.listen(3030, ()=>console.log('Server is running'));