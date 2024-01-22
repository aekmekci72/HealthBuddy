const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db/db_connection.js').promise();
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const bcrypt=require('bcrypt');

const cheerio = require('cheerio');
const axios = require('axios');

const corsOptions = {
  origin: 'http://localhost:3000',
};

const app = express();


app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const login_user_sql = `
    SELECT * 
    FROM login 
    WHERE username = ? AND password = ?;
  `;

  db.query(login_user_sql, [username, password], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      if (results.length > 0) {
        res.json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    }
  });
});

const create_user_sql = `
    INSERT INTO login 
        (username, password, email, name_first, name_last) 
    VALUES 
        (?, ?, ?, ?, ?);
`

const insert_user_info_sql = `
    INSERT INTO user_information
        (username)
    VALUES
        (?);
`

app.post("/signup", (req, res) => {
  const { username, password, email, name_first, name_last } = req.body;

  db.execute(create_user_sql, [username, password, email, name_first, name_last], (error, results) => {
      if (error) {
          console.log(error);
          res.status(500).send(error);
      } else {
          db.execute(insert_user_info_sql, [username], (error) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                res.json({ message: 'Signup successful' });
            }
        });
      }
  });
});




app.post("/profile", (req, res) => {
  const { username } = req.body;

  const get_user_profile_sql = `
    SELECT username, email, name_first, name_last
    FROM login 
    WHERE username = ?;
  `;

  db.query(get_user_profile_sql, [username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      if (results.length > 0) {
        res.json({ user: results[0] });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  });
  
});

app.post("/userinfo", (req, res) => {
  const { username } = req.body;

  const get_user_profile_sql = `
    SELECT age, sex, height, weight
    FROM user_information 
    WHERE username = ?;
  `;

  db.query(get_user_profile_sql, [username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      if (results.length > 0) {
        res.json({ user: results[0] });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  });
      
});

app.post("/getdiseases", (req, res) => {
  const get_diseases_sql = `
    SELECT *
    FROM diseases
  `;

  db.query(get_diseases_sql, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      if (results.length > 0) {
        res.json({ user: results });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  });
  
});

app.post("/getyears", (req, res) => {
  const get_years_sql = `
    SELECT *
    FROM years
    ORDER BY y desc
  `;

  db.query(get_years_sql, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      if (results.length > 0) {
        res.json({ user: results });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  });
  
});








app.post('/editusername', (req, res) => {
  const { username, newValue } = req.body;

  const update_username_sql = `
    UPDATE login
    SET username = ?
    WHERE username = ?;
  `;

  db.query(update_username_sql, [newValue, username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'Username updated successfully' });
    }
  });
});



app.post('/editemail', (req, res) => {
  const { username, newValue } = req.body;

  const update_email_sql = `
    UPDATE login
    SET email = ?
    WHERE username = ?;
  `;

  db.query(update_email_sql, [newValue, username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'Email updated successfully' });
    }
  });
});
app.post('/editname_first', (req, res) => {
  const { username, newValue } = req.body;

  const update_name_first_sql = `
    UPDATE login
    SET name_first = ?
    WHERE username = ?;
  `;

  db.query(update_name_first_sql, [newValue, username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'First name updated successfully' });
    }
  });
});
app.post('/editname_last', (req, res) => {
  const { username, newValue } = req.body;

  const update_name_last_sql = `
    UPDATE login
    SET name_last = ?
    WHERE username = ?;
  `;

  db.query(update_name_last_sql, [newValue, username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'Last name updated successfully' });
    }
  });
});

app.post('/editage', (req, res) => {
  const { username, newValue } = req.body;
  console.log(username);
  const update_age_sql = `
    UPDATE user_information
    SET age = ?
    WHERE username = ?;
  `;

  db.query(update_age_sql, [newValue, username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'Age updated successfully' });
    }
  });
});

app.post('/editsex', (req, res) => {
  const { username, newValue } = req.body;

  const update_sex_sql = `
    UPDATE user_information
    SET sex = ?
    WHERE username = ?;
  `;

  db.query(update_sex_sql, [newValue, username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'Sex updated successfully' });
    }
  });
});

app.post('/editheight', (req, res) => {
  const { username, newValue } = req.body;

  const update_height_sql = `
    UPDATE user_information
    SET height = ?
    WHERE username = ?;
  `;

  db.query(update_height_sql, [newValue, username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'Height updated successfully' });
    }
  });
});

app.post('/editweight', (req, res) => {
  const { username, newValue } = req.body;

  const update_weight_sql = `
    UPDATE user_information
    SET weight = ?
    WHERE username = ?;
  `;

  db.query(update_weight_sql, [newValue, username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'Weight updated successfully' });
    }
  });
});


app.post("/addfamilyhistory", (req, res) => {
  const { username, disease, generation } = req.body;

  const insertFamilyHistorySql = `
    INSERT INTO familyhistory (username, disease, generation)
    VALUES (?, ?, ?);
  `;

  db.query(insertFamilyHistorySql, [username, disease, generation], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'Family history added successfully' });
    }
  });
});


app.post("/deletefamilyhistory", (req, res) => {
  const { username, disease, generation } = req.body;

  const deleteFamilyHistorySql = `
    DELETE FROM familyhistory
    WHERE username = ? AND disease = ? AND generation = ?;
  `;

  db.query(deleteFamilyHistorySql, [username, disease, generation], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'Family history deleted successfully' });
    }
  });
});

app.post('/getuserfamilyhistory', (req, res) => {
  const { username } = req.body;

  const getUserFamilyHistorySql = `
    SELECT disease, generation
    FROM familyhistory
    WHERE username = ?;
  `;

  db.query(getUserFamilyHistorySql, [username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      const userFamilyHistory = results.map(row => ({ disease: row.disease, generation: row.generation }));
      res.json({ user: userFamilyHistory });
    }
  });
});







app.post("/addmedicalhistory", (req, res) => {
  const { username, disease, year } = req.body;

  const insertMedicalHistorySql = `
    INSERT INTO medicalhistory (username, disease, year)
    VALUES (?, ?, ?);
  `;

  db.query(insertMedicalHistorySql, [username, disease, year], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'Medical history added successfully' });
    }
  });
});


app.post("/deletemedicalhistory", (req, res) => {
  const { username, disease, year } = req.body;

  const deleteMedicalHistorySql = `
    DELETE FROM medicalhistory
    WHERE username = ? AND disease = ? AND year = ?;
  `;

  db.query(deleteMedicalHistorySql, [username, disease, year], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'Medical history deleted successfully' });
    }
  });
});

app.post('/getusermedicalhistory', (req, res) => {
  const { username } = req.body;

  const getUserMedicalHistorySql = `
    SELECT disease, year
    FROM medicalhistory
    WHERE username = ?
    ORDER BY year desc;
  `;

  db.query(getUserMedicalHistorySql, [username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      const userMedicalHistory = results.map(row => ({ disease: row.disease, year: row.year }));
      res.json({ user: userMedicalHistory });
    }
  });
});
app.post('/calculatepercentagematch', async (req, res) => {
  const { username } = req.body;

  const getAllDiseasesInfoSql = `
    SELECT name, symptomsOccurrence, geneticEffects
    FROM diseases;
  `;

  try {
    const diseasesInfo = await db.query(getAllDiseasesInfoSql);
    const getUserAgeSql = `
      SELECT age
      FROM user_information
      WHERE username = ?;
    `;

    const ageResult = await db.query(getUserAgeSql, [username]);
    const userAge = ageResult[0].age;
    const ageGroup = categorizeAge(userAge);

    const getUserSexSql = `
      SELECT sex
      FROM user_information
      WHERE username = ?;
    `;

    const sexResult = await db.query(getUserSexSql, [username]);
    const userSex = sexResult[0].sex;

    const getUserFamilyHistorySql = `
      SELECT disease, generation
      FROM familyhistory
      WHERE username = ?;
    `;

    const familyHistoryResults = await db.query(getUserFamilyHistorySql, [username]);
    const familyHistoryProbability = calculateFamilyHistoryProbability(familyHistoryResults);

    const getUserSymptomsSql = `
      SELECT symptom
      FROM symptoms
      WHERE username = ?;
    `;

    const userSymptomsResults = await db.query(getUserSymptomsSql, [username]);
    const symptomsProbability = calculateSymptomsProbability(userSymptomsResults, diseasesInfo);

    const percentMatchResults = calculateFinalPercentMatch(diseasesInfo, ageGroup, userSex, familyHistoryProbability, symptomsProbability);

    console.log(percentMatchResults);
    res.json({ diseaseMatchResults: percentMatchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

function categorizeAge(age) {
  const ageNumber = parseInt(age, 10); 
  if (ageNumber <= 1) return 'Newborn';
  else if (ageNumber <= 12) return 'Child';
  else if (ageNumber <= 65) return 'Adult';
  else return 'Elderly';
}

function calculateFamilyHistoryProbability(familyHistoryResults) {
  return familyHistoryResults.length > 0 ? 0.8 : 0.2;
}
function calculateSymptomsProbability(userSymptomsResults, diseasesInfo) {
  const symptomsProbability = {};

  userSymptomsResults.forEach((symptomRow) => {
    const userSymptom = symptomRow.symptom;

    diseasesInfo.forEach((diseaseRow) => {
      const diseaseName = diseaseRow.name;
      const symptomsOccurrence = diseaseRow.symptomsOccurrence;

      if (symptomsOccurrence && symptomsOccurrence.includes(userSymptom)) {
        if (!symptomsProbability[diseaseName]) {
          symptomsProbability[diseaseName] = 0;
        }
        symptomsProbability[diseaseName] += 0.2; 
      }
      
    });
  });

  return symptomsProbability;
}

// Function to calculate final percent match
function calculateFinalPercentMatch(diseasesInfo, ageGroup, userSex, familyHistoryProbability, symptomsProbability) {
  const percentMatchResults = {};

  diseasesInfo[0].forEach((diseaseRow) => {
    const diseaseName = diseaseRow.name;
    percentMatchResults[diseaseName] = 0.5; // Default percent match

    // Adjust percent match based on age group, genetic effects, family history, and symptoms
    console.log(ageGroup);
    console.log(diseaseRow.symptomsOccurrence)
    if (diseaseRow.symptomsOccurrence.includes(ageGroup)) {
      percentMatchResults[diseaseName] += 0.1; // Adjust weight based on your criteria
    }
    

    const geneticEffects = diseaseRow.geneticEffects;
    if (geneticEffects === 'X-linked recessive' && userSex === 'M') {
      percentMatchResults[diseaseName] += 0.2; // Adjust weight based on your criteria
    }

    percentMatchResults[diseaseName] += familyHistoryProbability;

    if (symptomsProbability[diseaseName]) {
      percentMatchResults[diseaseName] += symptomsProbability[diseaseName];
    }
  });

  return percentMatchResults;
}


app.post("/addsymptom", (req, res) => {
  const { username, symptom, date } = req.body;

  const insertSymptomsSql = `
    INSERT INTO symptoms (username, symptom, date)
    VALUES (?, ?, ?);
  `;

  db.query(insertSymptomsSql, [username, symptom, date], (error, results) => {
    
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'Symptoms added successfully' });
    }
  });
});


app.post("/deletesymptom", (req, res) => {
  const { username, symptom, date } = req.body;
  console.log(username,symptom,date);
  const deleteSymptomSql = `
    DELETE FROM symptoms
    WHERE username = ? AND symptom = ? AND date = ?;
  `;

  db.query(deleteSymptomSql, [username, symptom, date], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      res.json({ message: 'Symptom deleted successfully' });
    }
  });
});

app.post('/getusersymptoms', (req, res) => {
  const { username } = req.body;

  const getUserSymptomsSql = `
    SELECT symptom, date
    FROM symptoms
    WHERE username = ?;
  `;

  db.query(getUserSymptomsSql, [username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      const userSymptoms = results.map(row => ({ symptom: row.symptom, date: row.date }));
      res.json({ user: userSymptoms });
    }
  });
});


app.post("/getsymptoms", (req, res) => {
  const get_symptoms_sql = `
    SELECT DISTINCT symptom
    FROM disease_symptom_xref
    ORDER BY symptom
  `;

  db.query(get_symptoms_sql, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    } else {
      if (results.length > 0) {
        res.json({ user: results });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  });
  
});




app.listen(5000, () => {
  console.log('Server is running on port 5000');
});