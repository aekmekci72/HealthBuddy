# Mechatronics Research Project: Health Buddy

Abstract:

It is often difficult for individuals to adopt proactive health monitoring due to uncertainties surrounding the development of orphan diseases. These are characterized by both rarity and difficulty to diagnose, which poses a predicament as individuals may be unaware of how susceptible they are to develop them. This task becomes especially daunting in the context of how multifactorial aspects such as genetics, subtle symptoms, and other risk factors contribute to the likelihood of having an orphan disease. Health Buddy tracks and interprets risk factors in the lives of users to calculate the likelihood of the development of these diseases in one’s future through the use of data analysis. It seeks to aid individuals in determining how their medical realities can affect what diseases they may develop and aims to address the unique difficulties when it comes to even figuring out what diseases to look out for in one’s future. This research project is a React application that utilizes a SQL database and complex algorithms to make such predictions. The software dynamically updates itself to keep the information up-to-date and relevant to the user. I tested various algorithms regarding the interpretation of data inputted by users and finally settled upon one that uses a weighted approach. In the future, I will implement ML and an ANN model to analyze the data to give the users more sophisticated information regarding their condition. I will also work on integrating the software with wearables and health devices to gather more real-time health data. 

Software List:

React, which is a dynamic, component-based Javascript Framework 
Tailwind CSS, used for the styling of the front-end
MySQL, a platform used to store, access, and modify the database used
GitHub, to store and share the code
VSCode, the environment used to program Health Buddy
Figma, for wireframing of the front-end before development
.env, used to keep database information secure
JSON, a data format for transferring data between the server and the web application
And more additional libraries 

Prototype Assembly:

Step 1: Find data
In order to have a comprehensive and accurate algorithm to predict which diseases users are most likely to have, proper and accurate data must be collected first. Two organizations, NORD and Orphanet, are the lead researchers on orphan diseases, and both have comprehensive data collections that can be utilized in this context. 
Listed below are the links to the datasets, both of which are heavily related to each other:
Orphanet: https://www.orpha.net/ 
NORD: https://rarediseases.org/rare-diseases/ 

Step 2: Build database structure
Before scraping and storing the data so it is easier to utilize in the software, one must build a database structure not only to hold this information but also the user’s medical profile. This database was built with MySQL and later connected to with the server via a .env file. The tables required (with columns shown above in the image) are diseases, disease_symptom_xref, user_information, familyhistory, login, and symptoms. The diseases and disease_symptomm_xref tables contain the scraped data, and the rest have the user’s information. It is important to distinguish between primary keys (the yellow markers) and other data entries as this plays a huge role in the functionality of the database. MySQL was useful for relational database functionality, but Firebase, MongoDB, or others can be utilized for any modifications. 

Step 3: Build a web scraper
For the purposes of Health Buddy, data from NORD is utilized, and Orphanet is used to confirm the current accuracy of the algorithm later. One of the main issues with the NORD dataset is how the only public version of their data comes in a searchable structure on the user interface, not an easily downloadable format. Therefore, one needs to build a web scraper to collect the information and put it into the previously created database for further use and analysis. The Puppeteer and Express libraries were used to build this tool, and the code for this can be found on the GitHub repository shared later in this document under /scrape.js. It is important to note that a sample size of 30 randomly selected diseases was used; to store all the symptoms and other information for each one takes up a large number of rows, with a very limited capacity. Of course, this is scalable with larger memory available and Health Buddy’s current state is simply a proof of concept. 

Step 4: Develop UI
The next step in developing Health Buddy is to develop the user interface so that people can interact with the software, making it personalized with their own data and health recommendations and predictions. Once the client-side information is able to be inputted, the algorithm can utilize this data to provide users with their results and recommendations for further steps. For a React application, Tailwind CSS is especially useful for aesthetics with easy and manageable components. 

Step 5: Connect the front end to the server 
Once there are methods for users to be able to input their information, one must connect the front end of Health Buddy to the server. This provides two different functionalities: active communication with the database from the server, and reactivity with the application, ensuring the program to be more dynamic. 
For database security within the GitHub link provided, the .env file is in the .gitignore file. In order to utilize this code, one needs to provide a database to link to the server. To connect, a .env format is provided below, to be put into the / directory (not client or db):

DB_HOST = 
DB_POST = 
DB_USER = 
DB_PASSWORD = 
DB_DATABASE = 
DB_CONNECT_TIMEOUT = 

The connect timeout is typically 10000, although this can be modified to preference. 
Once the .env file is provided, db/db_connection.js will establish the connection. 

Step 6: Develop prediction algorithm
Arguably the most important server request is the prediction algorithm (http://localhost:5000/calculatepercentagematch). This analyzes all of the user data and compares it to the scraped data from NORD to determine what orphan diseases one is likely to have or develop in the future. In the GitHub, it is a system based on weight in the categories of age, sex, symptoms, family history, and other potential risk factors. Currently, however, this method is being transferred to a sequential neural network which will more accurately be able to predict orphan diseases. Additional libraries used for this include pandas, tensorflow, numpy, sklearn.model_selection, sklearn.preprocessing, sklearn.metrics, and matplotlib.pyplot for a Python version of this. 

Step 7: Finished!
Now that the basic functionality of Health Buddy is completed, one can run the software by opening a terminal, ensuring the right folder is opened, and typing in the command npm run dev. If any errors occur, the most commonly present errors are the lack of an env file, dependencies not downloaded (this can be achieved with npm install), or lacking the command in package.json. This should utilize Concurrently to run the client and server sides at the same time. 

Therefore, scripts should look something like this:
"scripts": {
"start": "node server.js",
"server": "nodemon server.js",
"client": "npm start --prefix client",
"dev": "concurrently \"npm run client\" \"npm run server\""
},
