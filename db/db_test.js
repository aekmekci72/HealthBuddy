const db = require("./db_connection")

db.execute('INSERT INTO diseases (name) VALUES ("hi");', 
    (error, results) => {
        if (error)
            throw error;
        console.log(results);
    }
);

db.end();
