module.exports = {
  mongoURI: (process.env.NODE_ENV === 'production' && 'mongodb://camilo:123456@ds121945.mlab.com:21945/video-ideas-prod') || 'mongodb://localhost/video-ideas-dev'
}

