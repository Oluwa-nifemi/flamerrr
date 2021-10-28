const PrismicDOM = require('prismic-dom');
const Prismic = require('@prismicio/client');

const linkResolver = () => '/'

const initApi = (req) => {
    return Prismic.getApi(process.env.PRISMIC_ACCESS_ENDPOINT, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        req
    });
}

const middleware = (req, res, next) => {
    res.locals.ctx = {
        endpoint: process.env.PRISMIC_ACCESS_ENDPOINT,
        linkResolver
    }

    res.locals.PrismicDOM = PrismicDOM;

    initApi(req).then(api => {
        req.api = api

        next()
    })
}

exports.middleware = middleware