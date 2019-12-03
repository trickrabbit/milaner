require('dotenv').config()
const express = require('express')
const cloudinary = require('cloudinary')
const formData = require('express-form-data')
const cors = require('cors')
const { CLIENT_ORIGIN } = require('./config')

const app = express()

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
})
  
app.use(cors({ 
  origin: CLIENT_ORIGIN 
})) 

app.use(formData.parse())

app.get('/wake-up', (req, res) => {


    return res.send('👌')
})
app.post('/image-upload', (req, res) => {

  const values = Object.values(req.files)
  const promises = values.map(image => cloudinary.uploader.upload(image.path))
  
  Promise
    .all(promises)
    .then(results => res.json(results))
    .catch((err) => res.status(400).json(err))
})

app.get('/images/:expression', (req, res) => {
  cloudinary.v2.search
      .expression(req.params['expression'])
      .with_field('context')
      .with_field('tags')
      .max_results(10)
      .execute()
      .then(result=> {
        console.log(result)
        
      })
            //.then(result=>res.json(result)
      .catch((err) => res.status(400).json(err))
})

function extractImages(result) {
    return result['resources'] || [];
}

app.listen(process.env.PORT || 8080, () => console.log('👍'))