require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const Prismic = require('@prismicio/client');
const {middleware} = require('./prismic')

app.use(middleware)

app.set('views', path.join(__dirname, 'views/pages'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    req.api.query(Prismic.Predicates.at('document.type', 'home')).then(data => {
        res.render('home')
    })
})

app.get('/about', (req, res) => {
    req.api.query(Prismic.Predicates.any('document.type', ['meta', 'about']))
        .then(response => {
            const {results} = response;
            const [meta, about] = results;

            res.render('about', {
                meta,
                about
            })
        })
})

app.get('/collection/:id', (req, res) => {
    req.api.getByUID('collection', req.params.id)
        .then(data => {
            res.render('collection')
        })
})

app.get('/detail/:id', (req, res) => {
    res.render('detail')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})