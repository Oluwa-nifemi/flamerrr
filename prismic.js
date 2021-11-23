const PrismicDOM = require('prismic-dom');
const Prismic = require('@prismicio/client');

const linkResolver = () => '/'

const initApi = (req) => {
    return Prismic.getApi(process.env.PRISMIC_ACCESS_ENDPOINT, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        req
    });
}

const handleLinkResolver = doc => {
    console.log(doc)
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

const prismicMiddleware = (req, res, next) => {
    res.locals.ctx = {
        endpoint: process.env.PRISMIC_ACCESS_ENDPOINT,
        linkResolver
    }

    res.locals.PrismicDOM = PrismicDOM;

    res.locals.Link = handleLinkResolver

    res.locals.Numbers = index => {
        const numbers = ['One', 'Two', 'Three', 'Four'];

        return numbers[index] || ''
    }

    initApi(req).then(api => {
        req.api = api

        next()
    })
}

exports.prismicMiddleware = prismicMiddleware