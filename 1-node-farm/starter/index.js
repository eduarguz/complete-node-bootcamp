const fs = require('fs');
const http = require('http');
const url = require('url');

// Blocking way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');


// Non blocking
// fs.readFile('./txt/start.txt', 'utf-8', (error, data) => {
//     if (error) return console.log('error');

//     fs.readFile(`./txt/${data}.txt`, 'utf-8', (error, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (error, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('file has been written')
//             })
//          })
//      })
// })

const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    
    return output;
}

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);        

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')


const server = http.createServer((req, res) => {
    const pathName = req.url;
    
    if(pathName === '/' || pathName === '/overview') {
        
        const cardsHtml = dataObj.map(el => replaceTemplate(templateCard, el)).join("")
        const output = templateOverview.replace(/{%PRODUCT_CARDS%}/, cardsHtml);

        res.writeHead(200, {'Content-type': 'text/html'})
        res.end(output);
    } else if (pathName === '/product') {

        res.end('This is the product');
    } else if (pathName === '/api'){

        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data);
    } else {

        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listeningto request on port 8000');
});