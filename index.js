require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

morgan.token('body', (request) => {
	return JSON.stringify(request.body);
});

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status - :body'));

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

app.get('/info', (request, response) => {
	Person.find({}).then((persons) => {
		response.send(
			`<p>Phonebook has info for ${
				persons.length
			}<br/><br/>${Date().toString()}</p>`
		);
	});
});

app.get('/api/persons', (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id).then((person) => {
		response.json(person);
	});
});

app.delete('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id).then((person) => {
		response.status(204).end();
	});
});

app.post('/api/persons', (request, response) => {
	const body = request.body;

	if (body.name === undefined) {
		return response.status(400).json({
			error: 'name missing',
		});
	}

	if (body.number === undefined) {
		return response.status(400).json({
			error: 'number missing',
		});
	}

	// if (persons.find((person) => person['name'] === body.name)) {
	// 	return response.status(400).json({
	// 		error: 'name must be unique',
	// 	});
	// }

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save().then((savedPerson) => {
		response.json(savedPerson);
	});
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
