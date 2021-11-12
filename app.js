require('dotenv').config()

const express = require('express')
const errorhandler = require('errorhandler')
const port = 3000
const path = require('path')
const Prismic = require('@prismicio/client');
const {middleware} = require('./prismic')

const app = express()

if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler())
}

app.use(middleware)

app.set('views', path.join(__dirname, 'views/pages'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    req.api.query(Prismic.Predicates.at('document.type', 'home')).then(data => {
        res.render('home')
    })
})

app.get('/about', async (req, res) => {
    const meta = await req.api.getSingle('meta')
    const about = await req.api.getSingle('about')

    res.render('about', {
        meta,
        about
    })
})

app.get('/collection/:id', (req, res) => {
    req.api.getByUID('collection', req.params.id)
        .then(data => {
            res.render('collection')
        })
})

app.get('/detail/:id', async (req, res) => {
    const meta = await req.api.getSingle('meta')
    const product = await req.api.getByUID('product', req.params.id, {
        fetchLinks: 'collection.title',
    })

    console.log(product)
    res.render('detail', {
        meta,
        product
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})