const fs = require('fs');
const cheerio = require('cheerio');
const url = 'https://en.wikipedia.org/wiki/List_of_web_browsers';

const getSource = () => fs.readFileSync('./mocks/list.html', 'utf8');
const $ = cheerio.load(getSource());

const removeEndNumber = (name) => {
    let a = name.split(' ');
    let last = a.pop();

    return parseInt(last) ? a.join(' ') : name;
}

const cleanLinks = (wrapper) => $(wrapper)
                                    .eq(0)
                                    .find('a')
                                    .map((i, el) => $(el).text())
                                    .toArray()
                                    .filter((name) => !name.startsWith('['));

const getByYears = () => {
    const rows = $('table').eq(0).find('tr');

    const table = $(rows).toArray().reduce((acc, row) => {
        const year = $(row).find('th').text().trim();
        if (parseInt(year)) {
            acc[year] = cleanLinks($(row).find('td')).map(item => removeEndNumber(item));
        }
        return acc;
    }, {})

    return table;
} 

const ret = {
    source: {
        url,
        name: 'Wikipedia'
    },
    data: getByYears()
}

console.log(ret);
