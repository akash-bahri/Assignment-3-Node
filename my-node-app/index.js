const express = require('express');
const session = require('express-session'); // Import the express-session middleware
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
var Answers = [];
var Questions = ["", "What is your name?", "What is your age?", "What is your favorite color?"];
let c = 0;
app.use(cors());
app.use(bodyParser.json());

// Configure the express-session middleware
app.use(session({
    secret: '76597608687669757', 
}));

app.get('/', (req, res) => {
    const sessionData = req.session;

    if (sessionData.question >= 3 || c >= 3) {
        res.send({ type: false, message: Answers });

    }
    // if session exists then next question else first question
    else if (sessionData.question || c > 0) {
        // res.send(`Hello, ${sessionData.question}!`);
        res.send({ type: true, question: Questions[c + 1] });
        console.log("session question exists");

    } else {
        res.send({ type: true, question: Questions[1] });
        console.log("session question does not exist");
    }
});

app.post('/user', (req, res) => {
    const { answer } = req.body;

    if (answer) {
        //req.session.username = question; // Store data in the session
        if (req.session.question || c > 0) {

            req.session.question = c + 1;
            c++;
        }
        else {
            req.session.question = 1;
            c=1;
        } req.session.save();

        console.log(req.session.question);
        Answers[c] = answer;
        console.log(Answers);
        res.send({ message: `Hello, ${answer}` });


    } else {
        res.status(400).json({ error: 'Please provide a username.' });
    }
});

app.get('/clear', (req, res) => {
    //req.session.destroy();
    res.send('Session cleared');
    c=0;
    Answers = [];
    req.session.question = 0;

});

const hostname = '127.0.0.1';

app.listen(port, hostname, () => console.log(`Example app listening on port http://${hostname}:${port}/`));

