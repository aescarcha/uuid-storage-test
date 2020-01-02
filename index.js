const mysql = require('mysql');
const uuid = require('uuid');

const conn = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'toor',
    database: 'uuidtest'
};

const config = {
    batchSize: 50,
    loopLimit: 50000
};

const connection = mysql.createConnection(conn);

connection.connect();
connection.query('TRUNCATE TABLE users', function (error, results, fields) {
    if (error) throw error;
    console.log('Truncated users');
});

connection.query('TRUNCATE TABLE users_num', function (error, results, fields) {
    if (error) throw error;
    console.log('Truncated users_num');
});

const resultStorage = [];
const numericStorage = [];

function insertUsers(users, table = 'users') {
    return new Promise((resolve, reject) => {
        const datePre = new Date();
        const query =  connection.query(`INSERT INTO ${table} (id, email, password) VALUES ?` , [users], function (error, results, fields) {
            if (error) reject(error);
            const dateAfter = new Date();
            const result = {
                pre: datePre,
                after: dateAfter,
                elapsed: dateAfter.getTime() - datePre.getTime()
            };

            resolve(result);
        });
    });
}


function summarizeResults() {
    const uuidResult = summarizeResult(resultStorage);
    const numericResult = summarizeResult(numericStorage);

    console.log(`Uuid result:`, uuidResult);
    console.log(`Numeric result:`, numericResult);
}


function summarizeResult(storage) {
    const total = storage.reduce((acc, result) => acc + result.elapsed, 0);
    const avg = total / storage.length;

    return {
        total,
        avg,
        batchSize: config.batchSize,
        batches: storage.length,
        rows: storage.length * config.batchSize
    };
}


(async () => {
    for (let x = 0; x < config.loopLimit; x++) {
        const users = [];
        const numericUsers = [];
        for (let i = 0; i < config.batchSize; i++) {
            users.push(
                [
                    uuid.v4(),
                    `${Date.now()}eeee@asdasda.com`,
                    `${Date.now()}lelelele`
                ]
            );

            numericUsers.push(
                [
                    undefined,
                    `${Date.now()}eeee@asdasda.com`,
                    `${Date.now()}lelelele`
                ]
            );
        }
        const result = await insertUsers(users);
        // console.log(`UUID Batch inserted ${users.length} rows, took ${result.elapsed} ms`);
        resultStorage.push(result);

        const numericResult = await insertUsers(numericUsers, 'users_num');
        // console.log(`Numeric Batch inserted ${numericUsers.length} rows, took ${numericResult.elapsed} ms`);
        numericStorage.push(numericResult);
    }

})().then(() => {
    console.log('Finished');
    connection.end();
    summarizeResults();
});
