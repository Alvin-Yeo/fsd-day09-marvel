// load modules
const express = require('express');
const handlebars = require('express-handlebars');
const getComics = require('./fetch');

// configure port
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

// create an instance of express
const app = express();

// configure handlebars
app.engine('hbs', handlebars( { defaultLayout: 'default.hbs' } ));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.status(200);
    res.type('text/html');
    res.render('index');
})

app.get('/comics', async(req, res) => {
    try {
        const comics = await getComics();
        // console.log('>>> Comics: ', comics);
        res.status(200);
        res.set('Cache-Control', 'public, max-age=3600');
        res.type('text/html');
        res.render('comics', { comics });
    } catch(err) {
        res.status('500');
        res.type('text/html');
        res.send(`Unable to fetch comics from api: ${err}`);
    }
});

// static resources
app.use(express.static(__dirname + '/static'));

// start server
if(process.env.PUBLIC_API_KEY && process.env.PRIVATE_API_KEY) {
    app.listen(PORT, () => {
        console.info(`Application started on PORT ${PORT} at ${new Date()}`);
    });
} else {
    console.error('Public and private API_KEY not found.')
}