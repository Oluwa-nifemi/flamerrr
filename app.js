require('dotenv').config()

const port = 3000
const path = require('path')
const Prismic = require('@prismicio/client');
const {prismicMiddleware} = require('./prismic')

const express = require('express')
const errorhandler = require('errorhandler')
const logger = require('morgan')
const methodOverride = require('method-override')

const app = express()

if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler())
}

app.use(logger('dev'))
app.use(methodOverride())

const getDefaults = async api => {
    const meta = await api.getSingle('meta')
    const navigation = await api.getSingle('navigation')
    const preloader = await api.getSingle('preloader')

    return {
        meta,
        navigation,
        preloader
    }
}

app.use(prismicMiddleware)

app.set('views', path.join(__dirname, 'views/pages'))
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
    const api = req.api
    const defaults = await getDefaults(api)
    const home = await api.getSingle('home')

    const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collection'), {
        fetchLinks: 'product.image'
    })

    res.render('home', {
        ...defaults,
        collections,
        home
    })
})

app.get('/about', async (req, res) => {
    const defaults = await getDefaults(req.api)
    const about = await req.api.getSingle('about')
    console.log(defaults.navigation)

    res.render('about', {
        about,
        ...defaults
    })
})

app.get('/collections', async (req, res) => {
    const defaults = await getDefaults(req.api)
    const home = await req.api.getSingle('home')

    const { results: collections } = await req.api.query(Prismic.Predicates.at('document.type', 'collection'), {
        fetchLinks: 'product.image'
    })

    res.render('collections', {
        ...defaults,
        collections,
        home
    })
})

app.get('/detail/:id', async (req, res) => {
    const defaults = await getDefaults(req.api)
    const product = await req.api.getByUID('product', req.params.id, {
        fetchLinks: 'collection.title',
    })
    console.log(defaults.navigation)

    res.render('detail', {
        product,
        ...defaults
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})