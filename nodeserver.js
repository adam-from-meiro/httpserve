const http = require('node:http');

http.createServer((request, response) => {
    if (request.method !== "POST") {
        response.statusCode = 405;
        return response.end("Method not allowed");
    }

    let body = [];
    request
        .on('data', chunk => {
            body.push(chunk);
        })
        .on('end', () => {
            try {
                body = Buffer.concat(body).toString();
                const parsedBody = JSON.parse(body);
                const events = parsedBody.events;
                //console.log(events);
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(events));
            } catch (error) {
                response.statusCode = 403;
                response.end("Cannot find events");
            }
        });
})
.listen(8000, () => {
    console.log(`Server running on http://localhost:8000`);
});