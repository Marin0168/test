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
          * {
              background-image: url(Achtergrond.jpg);
          }

          body {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
          }

          .container {
              display: flex;
              justify-content: space-between;
              width: 80%;
              margin-top: 20px;
          }

          .data-section {
              width: 48%;
              border: 1px solid #ccc;
              padding: 10px;
              box-sizing: border-box;
          }
      </style>
  </head>
  <body>
      <h1>Stormbaan</h1>
      <div class="container">
          <div class="data-section">
              <h2>Maand</h2>
              ${displayData('month')}
          </div>

          <div class="data-section">
              <h2>Jaar</h2>
              ${displayData('year')}
          </div>
      </div>

      <script>
          // Wissel van pagina na 5 seconden (5000 milliseconden)
          setTimeout(function() {
              window.location.href = 'twister.html'; // Zorg ervoor dat deze pagina bestaat
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
        case 'month':
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
            sql = `SELECT * FROM \`tijden\` WHERE Datum BETWEEN '${startOfMonth}' AND '${endOfMonth}' ORDER BY Tijd ASC LIMIT 5`;
            break;
        case 'year':
            const startOfYear = new Date(currentDate.getFullYear(), 0, 1).toISOString().split('T')[0];
            const endOfYear = new Date(currentDate.getFullYear(), 11, 31).toISOString().split('T')[0];
            sql = `SELECT * FROM \`tijden\` WHERE Datum BETWEEN '${startOfYear}' AND '${endOfYear}' ORDER BY Tijd ASC LIMIT 5`;
            break;
        default:
            return "Invalid timeframe";
    }

    let result = "";

    connection.query(sql, (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            results.forEach((row, index) => {
                result += `Positie: ${index + 1}<br>`;
                result += `Naam: ${row.Naam}<br>`;
                result += `Tijd: ${row.Tijd}<br>`;
                result += `Datum: ${row.Datum}<br>`;
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
