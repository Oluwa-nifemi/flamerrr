require('dotenv').config()

const express = require('express')
const errorhandler = require('errorhandler')
const port = 3000
const path = require('path')
const Prismic = require('@prismicio/client');
const {prismicMiddleware} = require('./prismic')

const app = express()

if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler())
}

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

const handleLinkResolver = doc => {
    if (doc.type === 'product') {
        return `/detail/${doc.slug}`
    }

    if (doc.type === 'collections') {
        return '/collections'
    }

    if (doc.type === 'about') {
        return '/about'
    }

    return '/'
}

app.use(prismicMiddleware)

app.set('views', path.join(__dirname, 'views/pages'))
app.set('view engine', 'pug')

app.use((req, res, next) => {
    res.locals.Link = handleLinkResolver

    res.locals.Numbers = index => {
        const numbers = ['One', 'Two', 'Three', 'Four'];

        return numbers[index] || ''
    }

    next()
})

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
    const meta = await req.api.getSingle('meta')
    const product = await req.api.getByUID('product', req.params.id, {
        fetchLinks: 'collection.title',
    })

    res.render('detail', {
        meta,
        product
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})