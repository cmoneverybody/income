var
   express = require('express'),
   app = express(),
   port = process.env.PORT || 777;

app.use(express['static'](__dirname));
   
app.listen(port, function () {
    console.log('Listening on port "' + port + '".');
});