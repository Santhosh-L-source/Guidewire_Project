const http = require('http');
const data = JSON.stringify({ phone: 'admin', password: 'admin' });
const req = http.request({
    hostname: 'localhost', port: 5000, path: '/api/auth/login',
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
}, res => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => console.log('Status:', res.statusCode, '\nResponse:', body));
});
req.write(data);
req.end();
