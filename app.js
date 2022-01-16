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

app.use(errorhandler())
app.use(logger('dev'))
app.use(methodOverride())
app.use(express.static(path.join(__dirname, 'public')))
app.use(prismicMiddleware)

const getDefaults = async api => {
    const meta = await api.getSingle('meta')
    const navigation = await api.getSingle('navigation')
    const preloader = await api.getSingle('preloader')
    const home = await api.getSingle('home')
    const about = await api.getSingle('about')
    const {results: collections} = await api.query(Prismic.Predicates.at('document.type', 'collection'), {
        fetchLinks: 'product.image'
    })


    //Extract all image urls from pages and add them to
    const assets = []

    home.data.gallery.forEach(media => {
        assets.push(media.image.url)
    })

    about.data.gallery.forEach(media => {
        assets.push(media.image.url)
    })

    about.data.body.forEach(section => {
        if (section.slice_type === 'gallery') {
            section.items.forEach(item => {
                assets.push(item.image.url)
            })
        }
    })

    collections.forEach(collection => {
        collection.data.products.forEach(product => {
            assets.push(product.product.data.image.url)
        })
    })

    return {
        meta,
        navigation,
        preloader,
        collections,
        home,
        about,
        assets
    }
}

app.set('views', path.join(__dirname, 'views/pages'))
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
    const api = req.api
    const defaults = await getDefaults(api)

    res.render('home', defaults)
})

app.get('/about', async (req, res) => {
    const defaults = await getDefaults(req.api)

    res.render('about', defaults)
})

app.get('/collections', async (req, res) => {
    const defaults = await getDefaults(req.api)

    res.render('collections', defaults)
})

app.get('/detail/:id', async (req, res) => {
    const defaults = await getDefaults(req.api)
    const product = await req.api.getByUID('product', req.params.id, {
        fetchLinks: 'collection.title',
    })
    const home = await req.api.getSingle('home')

    res.render('detail', {
        product,
        ...defaults
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})