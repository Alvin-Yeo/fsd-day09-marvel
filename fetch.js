// load modules
const fetch = require("node-fetch");
const withQuery = require("with-query").default;
const md5 = require("md5");

const BASE_URL = 'http://gateway.marvel.com/v1/public';

const getEndpoint = (url) => {
    const PUBLIC = process.env.PUBLIC_API_KEY;
    const PRIVATE = process.env.PRIVATE_API_KEY;
    const ts = (new Date()).getTime();

    const preHash = `${ts}${PRIVATE}${PUBLIC}`;
    const hash = md5(preHash);

    // console.log(hash);

    const endpoint = withQuery(url, {
        ts,
        apikey: PUBLIC,
        hash
    });

    return endpoint;
};

const getComics = async() => {
    const url = BASE_URL + '/comics';
    const endpoint = getEndpoint(url);

    try {
        const result = await fetch(endpoint);
        const data = await result.json();
        
        // console.log('>>> Data: ', data);

        return data.data.results;
    } catch(err) {
        console.error(`Unable to fetch api: `, err);
    }
};

module.exports = getComics;