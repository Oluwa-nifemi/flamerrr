require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const pug = require('pug')
const path = require('path')

app.set('views', path.join(__dirname, 'views/pages'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/collections', (req, res) => {
  res.render('collections')
})

app.get('/detail/:id', (req, res) => {
  res.render('detail')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})