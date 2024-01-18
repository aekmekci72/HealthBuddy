const db = require("./db_connection")

db.execute('INSERT INTO music_ccchallenge (file) VALUES ("hfdiaugfbaskdyfbg");', 
    (error, results) => {
        if (error)
            throw error;
        console.log(results);
    }
);

db.end();
