const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// Connectie naar de database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'username', // Vervang met je database gebruiker
  password: 'password', // Vervang met je database wachtwoord
  database: 'your_database' // Vervang met je database naam
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Verbonden met de database!');
});

// Statische bestanden serveren (zoals je CSS en afbeeldingen)
app.use(express.static(path.join(__dirname, 'public')));

// Render de HTML-pagina
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
          @font-face {
              font-family: 'MijnAangepasteLettertype';
              src: url('Arista2.0.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
          }

          * {
              margin: 0px;
          }

          body {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              font-size: 50px;
              color: white;
              font-family: 'MijnAangepasteLettertype', sans-serif;
          }

          .container {
              display: flex;
              justify-content: space-between;
              width: 90%;
              margin-top: 20px;
          }

          .data-section {
              width: 48%;
              border: 1px solid #ccc;
              padding: 10px;
              box-sizing: border-box;
          }

          .position {
              font-size: 40px;
              text-align: left;
              display: flex;
              align-items: center;
          }
      </style>
  </head>
  <body>
      <h1>Twister Records</h1>
      <div class="container">
          <div class="data-section">
              <h2>Dagelijks</h2>
              ${displayData('day')}
          </div>

          <div class="data-section">
              <h2>Wekelijks</h2>
              ${displayData('week')}
          </div>
      </div>

      <script>
          // Wissel van pagina na 5 seconden (5000 milliseconden)
          setTimeout(function() {
              window.location.href = 'twisterLang.html'; // Zorg ervoor dat deze pagina bestaat
          }, 5000);
      </script>
  </body>
  </html>
  `);
});

// Data opvragen uit de database
function displayData(timeframe) {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];

    let sql;

    switch (timeframe) {
        case 'day':
            sql = `SELECT * FROM \`tijden\` WHERE Datum = '${currentDateString}' AND Soort = 'twister' ORDER BY Tijd ASC LIMIT 5`;
            break;
        case 'week':
            const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)).toISOString().split('T')[0];
            const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7)).toISOString().split('T')[0];
            sql = `SELECT * FROM \`tijden\` WHERE Datum BETWEEN '${startOfWeek}' AND '${endOfWeek}' ORDER BY Tijd ASC LIMIT 5`;
            break;
        default:
            return 'Invalid timeframe';
    }

    let result = '';

    connection.query(sql, (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            results.forEach((row, index) => {
                result += `<div class="position">${index + 1}</div>`;
                result += `${row.Naam} ${row.Tijd}<br>`;
                result += '<hr>'; // Voeg een horizontale lijn toe voor betere scheiding
            });
        } else {
            result = `No records found for ${timeframe}`;
        }
    });

    return result;
}

// Server starten
app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});
