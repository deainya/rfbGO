module.exports = {
  port: process.env.port || 3005,
  'secret': 'secretforrfbgoinitiative',

  'smpts':'smtps://deainru%40gmail.com:mail4deainru@smtp.gmail.com',
  'mail_addresser': '"rfbGO" <rfbGO@deain.ru>',
  'mail_subject': 'Оповещение rfbGO ✔',

  'database': 'mongodb://user:pass@localhost:27017/rfbgo-dev'
              //'mongodb://user:pass@localhost:27017/partnergo-dev'
};
