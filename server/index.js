const express = require('express');
const axios = require('axios');
const cors = require("cors");


const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/api/authors', (req, res) => {
  const name = req.query.name;
  axios.get(`https://data.bnf.fr/fr/api/results/person?term=${name}`)
    .then(response => {
      const authors = response.data;
      console.log(`First general request:${JSON.stringify(authors)}`);
      
      //Variable to keep track of the current request
      let currentIndex = 0;

      const makeRequest = () => {
        const author = authors[currentIndex];
        if (author) {
          if (author.title) console.log(`Making request to https://data.bnf.fr/fr/api/${author.eid}/informations for ${author.title}`);
          axios.get(`https://data.bnf.fr/fr/api/${author.eid}/informations`)
            .then(authorInfos => {
              const authorInfosData = authorInfos.data
              if (!authorInfosData) {
                console.log("Error: Invalid response data");
                res.sendStatus(500);
                return;
              }
              //console.log("Response data:", authorInfosData);
              //Look for Deathdate and set publicDomain info
              if (authorInfos.data.details) {
                const deathSection = authorInfos.data.details.find(([key]) => key === "Mort");
                if (deathSection) {
                  const deathDateMatch = /content="(\d{4}-\d{2}-\d{2})"/.exec(deathSection[1]);
                  if (deathDateMatch) {
                    const deathDate = new Date(deathDateMatch[1]);
                    const deathYear = deathDate.getFullYear();
                    const currentYear = new Date().getFullYear();
                    if (deathYear && deathYear + 70 > currentYear) {
                        author.publicDomain = false;
                      } else {
                        author.publicDomain = true;
                      }                      
                  }
                }        
                author.img = authorInfos.data.cartouche.img_url;
              };
              currentIndex++;
              //Recursively call the function with a delay of 1 sec (if set to 1000)
              setTimeout(makeRequest, 0);
            })
            .catch(error => {
              if (author.title) console.log(`Error in request for author ${author.title} error : ${error}`);
              currentIndex++;
              //Recursively call the function with a delay of 1 sec (if set to 1000)
              setTimeout(makeRequest, 0);
            });
        }else{
          //If no more authors left, return the response
          res.send(authors);
        }
      }
      makeRequest();
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
});


app.listen(port, () => console.log(`Server listening on port ${port}`));

