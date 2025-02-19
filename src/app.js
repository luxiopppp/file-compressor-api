const express = require('express');
const cors = require('cors');
require( 'dotenv' ).config();

const app = express();
app.use(cors());



app.listen(process.env.PORT || 8080, () => console.log('app running on port 3000'))
