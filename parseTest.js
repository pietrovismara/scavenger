const qs = require('querystring');
const url = `fn=Firenze%2C+FI&fc=43.76956%7C11.255814&fcc=IT&tn=Bologna%2C+BO&tc=44.494887%7C11.342616&tcc=IT&db=30%2F12%2F2016&sort=trip_date&order=asc&limit=10&page=1`;
console.log(qs.parse(url));
