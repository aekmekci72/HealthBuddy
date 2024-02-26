const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const db = require('./db/db_connection.js');
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




app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log('here');
  console.log('Username:', username);
  console.log('Password:', password);

  const login_user_sql = `
    SELECT * 
    FROM login 
    WHERE username = ? AND password = ?;
  `;

  try {
    const [results] = await db.query(login_user_sql, [username, password]);
    console.log('here1');
    if (results.length > 0) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

const create_user_sql = `
    INSERT INTO login 
        (username, password, email, name_first, name_last) 
    VALUES 
        (?, ?, ?, ?, ?);
`;

const insert_user_info_sql = `
    INSERT INTO user_information
        (username)
    VALUES
        (?);
`;

app.post("/signup", async (req, res) => {
  const { username, password, email, name_first, name_last } = req.body;

  try {
    await db.execute(create_user_sql, [username, password, email, name_first, name_last]);
    await db.execute(insert_user_info_sql, [username]);
    res.json({ message: 'Signup successful' });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/profile", async (req, res) => {
  const { username } = req.body;

  const get_user_profile_sql = `
    SELECT username, email, name_first, name_last
    FROM login 
    WHERE username = ?;
  `;

  try {
    const [results] = await db.query(get_user_profile_sql, [username]);
    if (results.length > 0) {
      res.json({ user: results[0] });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post("/userinfo", async (req, res) => {
  const { username } = req.body;

  const get_user_profile_sql = `
    SELECT age, sex, height, weight
    FROM user_information 
    WHERE username = ?;
  `;

  try {
    const [results] = await db.query(get_user_profile_sql, [username]);
    if (results.length > 0) {
      res.json({ user: results[0] });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post("/getdiseases", async (req, res) => {
  const get_diseases_sql = `
    SELECT *
    FROM diseases
  `;

  try {
    const [results] = await db.query(get_diseases_sql);
    if (results.length > 0) {
      res.json({ user: results });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});


app.post('/getspecificdiseaseinfo', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Disease name is required.' });
  }

  const get_specific_disease_sql = `
    SELECT d.geneticEffects, d.symptomsOccurrence, dx.symptom, dx.frequency
    FROM diseases d
    LEFT JOIN disease_symptom_xref dx ON d.name = dx.disease
    WHERE d.name = ?
  `;

  try {
    const [results] = await db.query(get_specific_disease_sql, [name]);

    if (results.length > 0) {
      const { geneticEffects, symptomsOccurrence } = results[0];
      const symptoms = results.map((result) => `${result.symptom}: ${result.frequency}`).filter(Boolean); // Filter out null values

      res.json({
        name,
        geneticEffects,
        symptomsOccurrence,
        symptoms,
      });
    } else {
      res.status(404).json({ message: 'Disease not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});



app.get("/getdiseaseinfo", async (req, res) => {
  const get_diseases_sql = `
    SELECT *
    FROM diseases
  `;

  try {
    const [results] = await db.query(get_diseases_sql);
    if (results.length > 0) {
      res.json({ user: results });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post("/getyears", async (req, res) => {
  const get_years_sql = `
    SELECT *
    FROM years
    ORDER BY y desc
  `;

  try {
    const [results] = await db.query(get_years_sql);
    if (results.length > 0) {
      res.json({ user: results });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post('/editusername', async (req, res) => {
  const { username, newValue } = req.body;

  const update_username_sql = `
    UPDATE login
    SET username = ?
    WHERE username = ?;
  `;

  try {
    await db.query(update_username_sql, [newValue, username]);
    res.json({ message: 'Username updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post('/editemail', async (req, res) => {
  const { username, newValue } = req.body;

  const update_email_sql = `
    UPDATE login
    SET email = ?
    WHERE username = ?;
  `;

  try {
    await db.query(update_email_sql, [newValue, username]);
    res.json({ message: 'Email updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post('/editname_first', async (req, res) => {
  const { username, newValue } = req.body;

  const update_name_first_sql = `
    UPDATE login
    SET name_first = ?
    WHERE username = ?;
  `;

  try {
    await db.query(update_name_first_sql, [newValue, username]);
    res.json({ message: 'First name updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post('/editname_last', async (req, res) => {
  const { username, newValue } = req.body;

  const update_name_last_sql = `
    UPDATE login
    SET name_last = ?
    WHERE username = ?;
  `;

  try {
    await db.query(update_name_last_sql, [newValue, username]);
    res.json({ message: 'Last name updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post('/editage', async (req, res) => {
  const { username, newValue } = req.body;
  console.log(username);
  const update_age_sql = `
    UPDATE user_information
    SET age = ?
    WHERE username = ?;
  `;

  try {
    await db.query(update_age_sql, [newValue, username]);
    res.json({ message: 'Age updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post('/editsex', async (req, res) => {
  const { username, newValue } = req.body;

  const update_sex_sql = `
    UPDATE user_information
    SET sex = ?
    WHERE username = ?;
  `;

  try {
    await db.query(update_sex_sql, [newValue, username]);
    res.json({ message: 'Sex updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post('/editheight', async (req, res) => {
  const { username, newValue } = req.body;

  const update_height_sql = `
    UPDATE user_information
    SET height = ?
    WHERE username = ?;
  `;

  try {
    await db.query(update_height_sql, [newValue, username]);
    res.json({ message: 'Height updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post('/editweight', async (req, res) => {
  const { username, newValue } = req.body;

  const update_weight_sql = `
    UPDATE user_information
    SET weight = ?
    WHERE username = ?;
  `;

  try {
    await db.query(update_weight_sql, [newValue, username]);
    res.json({ message: 'Weight updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post("/addfamilyhistory", async (req, res) => {
  const { username, disease, generation } = req.body;

  const insertFamilyHistorySql = `
    INSERT INTO familyhistory (username, disease, generation)
    VALUES (?, ?, ?);
  `;

  try {
    await db.query(insertFamilyHistorySql, [username, disease, generation]);
    res.json({ message: 'Family history added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post("/deletefamilyhistory", async (req, res) => {
  const { username, disease, generation } = req.body;

  const deleteFamilyHistorySql = `
    DELETE FROM familyhistory
    WHERE username = ? AND disease = ? AND generation = ?;
  `;

  try {
    await db.query(deleteFamilyHistorySql, [username, disease, generation]);
    console.log(username, disease, generation);
    res.json({ message: 'Family history deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post('/getuserfamilyhistory', async (req, res) => {
  const { username } = req.body;

  const getUserFamilyHistorySql = `
    SELECT disease, generation
    FROM familyhistory
    WHERE username = ?;
  `;

  try {
    const [results] = await db.query(getUserFamilyHistorySql, [username]);
    const userFamilyHistory = results.map(row => ({ disease: row.disease, generation: row.generation }));
    res.json({ user: userFamilyHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post("/addmedicalhistory", async (req, res) => {
  const { username, disease, year } = req.body;

  const insertMedicalHistorySql = `
    INSERT INTO medicalhistory (username, disease, year)
    VALUES (?, ?, ?);
  `;

  try {
    await db.query(insertMedicalHistorySql, [username, disease, year]);
    res.json({ message: 'Medical history added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post("/deletemedicalhistory", async (req, res) => {
  const { username, disease, year } = req.body;

  const deleteMedicalHistorySql = `
    DELETE FROM medicalhistory
    WHERE username = ? AND disease = ? AND year = ?;
  `;

  try {
    await db.query(deleteMedicalHistorySql, [username, disease, year]);
    res.json({ message: 'Medical history deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post('/getusermedicalhistory', async (req, res) => {
  const { username } = req.body;

  const getUserMedicalHistorySql = `
    SELECT disease, year
    FROM medicalhistory
    WHERE username = ?
    ORDER BY year desc;
  `;

  try {
    const [results] = await db.query(getUserMedicalHistorySql, [username]);
    const userMedicalHistory = results.map(row => ({ disease: row.disease, year: row.year }));
    res.json({ user: userMedicalHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
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
    const userAge = ageResult[0][0].age;
    const ageGroup = categorizeAge(userAge);

    const getUserSexSql = `
      SELECT sex
      FROM user_information
      WHERE username = ?;
    `;

    const sexResult = await db.query(getUserSexSql, [username]);
    const userSex = sexResult[0][0].sex;

    const getUserSymptomsSql = `
      SELECT symptom
      FROM symptoms
      WHERE username = ?;
    `;

    const userSymptomsResults = await db.query(getUserSymptomsSql, [username]);

    const percentMatchResults = await calculateFinalPercentMatch(username, diseasesInfo, ageGroup, userSex, userSymptomsResults);

    console.log(percentMatchResults);
    res.json({ diseaseMatchResults: percentMatchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

async function calculateFinalPercentMatch(username, diseasesInfo, ageGroup, userSex, userSymptomsResults) {
  const percentMatchResults = {};
  const totalMatches = {};

  try {
    await Promise.all(diseasesInfo[0].map(async (diseaseRow) => {
      const diseaseName = diseaseRow.name;
      percentMatchResults[diseaseName] = 0.5;

      // Initialize totalMatches with the base percentage
      totalMatches[diseaseName] = 0.5;

      if (diseaseRow.symptomsOccurrence.includes(ageGroup) || diseaseRow.symptomsOccurrence.includes('variety of ages') || diseaseRow.symptomsOccurrence.includes('any time in life')) {
        percentMatchResults[diseaseName] += 0.1;
        
      }
      totalMatches[diseaseName] += 0.1;

      const geneticEffects = diseaseRow.geneticEffects;
      if (
        (geneticEffects === 'X-Linked Recessive' && userSex === 'F') ||
        geneticEffects === 'Autosomal Recessive' ||
        geneticEffects === 'Autosomal Dominant'
      ) {
        const isInFamilyHistory = await calculateFamilyHistoryProbability(username, diseaseName);
        console.log(`isInFamilyHistory for ${diseaseName}: ${isInFamilyHistory}`);
        if (isInFamilyHistory) {
          percentMatchResults[diseaseName] += isInFamilyHistory * 15;
           
        }
        totalMatches[diseaseName] += 7.25;
      }

      const symptomsProbability = await calculateSymptomsProbability(username, userSymptomsResults, diseaseRow);
      console.log(`Symptoms probability for ${diseaseName}: ${symptomsProbability[diseaseName]}`);
      if (symptomsProbability[diseaseName]) {
        percentMatchResults[diseaseName] += symptomsProbability[diseaseName];
        
      }
      totalMatches[diseaseName] += await getTotalSymptomsCountForDisease(diseaseName);
    }));
  } catch (error) {
    console.error(error);
  }

  console.log('Intermediate Results:', percentMatchResults, totalMatches);
  const percentageResults = {};
  Object.keys(percentMatchResults).forEach((diseaseName) => {
    const totalMatch = totalMatches[diseaseName];
    const percentage = (percentMatchResults[diseaseName] / totalMatch) * 100;
    percentageResults[diseaseName] = isNaN(percentage) ? 0 : percentage;
  });

  console.log('Final Percentage Results:', percentageResults);

  return percentageResults;
}




async function getTotalSymptomsCountForDisease(diseaseName) {
  const getDSXref = `
    SELECT COUNT(*) AS totalSymptoms
    FROM disease_symptom_xref
    WHERE disease = ?;
  `;

  const [result] = await db.query(getDSXref, [diseaseName]);
  return result[0].totalSymptoms;
}


async function calculateSymptomsProbability(username, userSymptomsResults, diseaseRow) {
  const symptomsProbability = {};
  if (userSymptomsResults && userSymptomsResults[0]) {
  const userSymptoms = userSymptomsResults[0].map(row => row.symptom);
  for (const userSymptom of userSymptoms) {

    const diseaseName = diseaseRow.name;

    if (!symptomsProbability[diseaseName]) {
      symptomsProbability[diseaseName] = 0;
    }

    const getDSXref = `
      SELECT *
      FROM disease_symptom_xref
      WHERE disease = ?;
    `;

    const [disease_symptom_xref] = await db.query(getDSXref, [diseaseName]);
    const hasSymptom = disease_symptom_xref.some(row => row.disease === diseaseName && row.symptom === userSymptom);

    if (hasSymptom) {
      symptomsProbability[diseaseName] += 0.2;
    }

  }
}



  return symptomsProbability;
}







function categorizeAge(age) {
  console.log(age);
  const ageNumber = parseInt(age, 10);

  if (isNaN(ageNumber)) {
    return 'Unknown';
  }

  if (ageNumber <= 1) return 'Newborn';
  else if (ageNumber <= 12) return 'Child';
  else if (ageNumber <= 19) return 'Teenager';
  else if (ageNumber <= 65) return 'Adult';
  else return 'Elderly';
}

async function calculateFamilyHistoryProbability(username, targetDisease) {
  // console.log(String(username), targetDisease);
  const getUserFamilyHistorySql = `
    SELECT disease, generation
    FROM familyhistory
    WHERE username = ? AND disease = ?;
  `;

  try {
    const [results] = await db.query(getUserFamilyHistorySql, [username, targetDisease]);
    console.log(results);
    let familyHistoryProbability = 0;

    (results).forEach((row) => {
      familyHistoryProbability += Math.pow(0.5, row['generation']);

    });
    console.log(familyHistoryProbability);
    return familyHistoryProbability;
  } catch (error) {
    console.error(error);
    return 0;
  }
}





// function calculateFinalPercentMatch(diseasesInfo, ageGroup, userSex, familyHistoryProbability, symptomsProbability) {
//   const percentMatchResults = {};

//   diseasesInfo[0].forEach((diseaseRow) => {
//     const diseaseName = diseaseRow.name;
//     percentMatchResults[diseaseName] = 0.5; 

//     if (diseaseRow.symptomsOccurrence.includes(ageGroup) || diseaseRow.symptomsOccurrence.includes('variety of ages') || diseaseRow.symptomsOccurrence.includes('any time in life')) {
//       percentMatchResults[diseaseName] += 0.1;
//       console.log(diseaseRow.symptomsOccurrence);
//     }

//     const geneticEffects = diseaseRow.geneticEffects;
//     if (geneticEffects === 'X-Linked Recessive' && userSex === 'F') {
//       percentMatchResults[diseaseName];
//       console.log(geneticEffects);
//       const isInFamilyHistory = familyHistoryProbability[diseaseName];
//         console.log(isInFamilyHistory);
//         if (isInFamilyHistory) {
//           percentMatchResults[diseaseName] += isInFamilyHistory;
//         }
//     }
//     else if (geneticEffects !='X-Linked Recessive'){
//       const isInFamilyHistory = familyHistoryProbability[diseaseName];
//         console.log(isInFamilyHistory);
//         if (isInFamilyHistory) {
//           percentMatchResults[diseaseName] += isInFamilyHistory;
//         }
//     }

    
//     console.log(symptomsProbability[diseaseName]);
//     console.log(diseaseName);

//     if (symptomsProbability[diseaseName]) {
//       percentMatchResults[diseaseName] += symptomsProbability[diseaseName];
//     }
//   });

//   return percentMatchResults;
// }


app.post("/addsymptom", async (req, res) => {
  try {
    const { username, symptom, date } = req.body;
    const insertSymptomsSql = `
      INSERT INTO symptoms (username, symptom, date)
      VALUES (?, ?, ?);
    `;
    await db.query(insertSymptomsSql, [username, symptom, date]);
    res.json({ message: 'Symptoms added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post("/deletesymptom", async (req, res) => {
  try {
    const { username, symptom, date } = req.body;
    const deleteSymptomSql = `
      DELETE FROM symptoms
      WHERE username = ? AND symptom = ? AND date = ?;
    `;
    await db.query(deleteSymptomSql, [username, symptom, date]);
    res.json({ message: 'Symptom deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post('/getusersymptoms', async (req, res) => {
  try {
    const { username } = req.body;
    const getUserSymptomsSql = `
      SELECT *
      FROM symptoms
      WHERE username = ?;
    `;
    const results = await db.query(getUserSymptomsSql, [username]);
    const userSymptoms = results[0].map(row => ({ symptom: row.symptom, date: row.date }));
    res.json({ user: userSymptoms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post("/getsymptoms", async (req, res) => {
  try {
    const get_symptoms_sql = `
      SELECT DISTINCT symptom
      FROM disease_symptom_xref
      ORDER BY symptom
    `;
    const results = await db.query(get_symptoms_sql);
    if (results.length > 0) {
      res.json({ user: results[0] });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.post("/getDiseasesSymptoms", async (req, res) => {
  const { disease } = req.body;

  try {
    const get_symptoms_sql = `
      SELECT DISTINCT symptom
      FROM disease_symptom_xref
      WHERE disease = ?
      ORDER BY symptom
    `;
    const results = await db.query(get_symptoms_sql, [disease]);
    if (results.length > 0) {
      const symptomsArray = results.map(result => result.symptom);
res.json(symptomsArray);

    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});