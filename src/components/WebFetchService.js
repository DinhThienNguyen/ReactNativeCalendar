const cheerio = require('react-native-cheerio');
import moment from 'moment';
export default class WebFetchService {

    async fetchOEP() {
        const searchUrl = `https://oep.uit.edu.vn/vi/thong-bao-chung`;
        const response = await fetch(searchUrl);  // fetch page 

        const htmlString = await response.text(); // get response text
        const $ = cheerio.load(htmlString);       // parse HTML string

        let temp = $("div.content > article")   // select result 
            .map((_, article) => ({       // map to an list of objects
                // the title of the news is in an a tag inside the article tag
                title: '[OEP] ' + $("a", article).text(), 
                // the upload date of the news is in a div tag inside the article tag
                // convert it to a unix timestamp
                timeStamp: moment($("div.submitted", article).text().slice(4, 22), "DD/MM/YYYY - HH:mm").unix(),
                // the link to the news is in an a tag inside the article tag
                link: 'https://oep.uit.edu.vn' + $("a", article).attr("href")
            }));

        let OEPNews = [];
        for (let i = 0; i < 10; i++) {
            OEPNews = [...OEPNews, temp[i]];
        }

        // return an array which contains news objects
        return OEPNews;
    }

    async fetchCTSV() {
        const searchUrl = `https://ctsv.uit.edu.vn/thong-bao`;
        const response = await fetch(searchUrl);  // fetch page 

        const htmlString = await response.text(); // get response text
        const $ = cheerio.load(htmlString);       // parse HTML string

        let temp = $("div.content > article")             // select result <li>s
            .map((_, article) => ({                      // map to an list of objects
                title: '[CTSV] ' + $("a", article).text(),
                timeStamp: moment($("div.submitted", article).text().slice(4, 22), "DD/MM/YYYY - HH:mm").unix(),
                link: 'https://ctsv.uit.edu.vn' + $("a", article).attr("href")
            }));

        let CTSVNews = [];
        for (let i = 0; i < 10; i++) {
            CTSVNews = [...CTSVNews, temp[i]];
        }
        return CTSVNews;
    }

    async fetchDAA() {
        const searchUrl = `https://student.uit.edu.vn/thong-bao-chung`;
        const response = await fetch(searchUrl);  // fetch page 

        const htmlString = await response.text(); // get response text
        const $ = cheerio.load(htmlString);       // parse HTML string

        let temp = $("div.view-content > div.views-row > article")             // select result <li>s
            .map((_, article) => ({                      // map to an list of objects
                title: '[DAA] ' + $("a", article).text(),
                timeStamp: moment($("div.submitted", article).text().slice(4, 22), "DD/MM/YYYY - HH:mm").unix(),
                link: 'https://student.uit.edu.vn' + $("a", article).attr("href")
            }));        
        
        let DAANews = [];
        for (let i = 0; i < 10; i++) {
            DAANews = [...DAANews, temp[i]];
        }        
        return DAANews;
    }
}