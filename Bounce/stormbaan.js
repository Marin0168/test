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
          }

          body {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              font-family: 'MijnAangepasteLettertype', sans-serif;
              background-image: url(Achtergrond.jpg);
              background-repeat: no-repeat;
              background-size: cover;
          }

          body::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              z-index: -1;
          }

          .container {
              display: flex;
              justify-content: space-between;
              width: 80%;
              margin-top: 0px;
          }

          .data-section {
              width: 48%;
          }

          .Text {
              font-size: 65px;
              color: white;
              text-shadow: 2px 2px 4px black;
          }

          h1, h2 {
              font-size: 75px;
              color: white;
          }

          h1 {
              font-size: 90px;
              background: linear-gradient(to right, rgb(255,0,255), rgb(0,0,255));
              border-radius: 20px;
          }

          h2 {
              border-radius: 20px;
          }

          #Dag {
              background-color: rgb(255,0,255);
          }

          #Week {
              background-color: rgb(0,0,255);
          }
      </style>
  </head>
  <body>
      <h1>Stormbaan Records</h1>
      <div class="container">
          <div class="data-section">
              <h2 id="Dag">Dagelijks</h2>
              ${displayData('day')}
          </div>

          <div class="data-section">
              <h2 id="Week">Wekelijks</h2>
              ${displayData('week')}
          </div>
      </div>

      <script>
          setTimeout(function() {
              window.location.href = 'stormbaanLang.html';
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
            sql = `SELECT * FROM \`tijden\` WHERE Datum = '${currentDateString}' AND Soort = 'stormbaan' ORDER BY Tijd ASC LIMIT 5`;
            break;
        case 'week':
            const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)).toISOString().split('T')[0];
            const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7)).toISOString().split('T')[0];
            sql = `SELECT * FROM \`tijden\` WHERE Datum BETWEEN '${startOfWeek}' AND '${endOfWeek}' ORDER BY Tijd ASC LIMIT 5`;
            break;
        // Voegt eventueel andere tijdframes toe zoals "month" en "year"
        default:
            return "Invalid timeframe";
    }

    let result = "";

    connection.query(sql, (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            results.forEach((row, index) => {
                result += `<p class='Text'>${index + 1} ${row.Naam} ${row.Tijd}</p>`;
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
