## Schema

```

CREATE DATABASE uuidtest;

USE uuidtest;

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users_num` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

```

## Running

Configure in the file the desired batch size and number of inserts, the database connection, and then run
    
    node index.js


### Running mysql in docker (local port 3308)

    docker run -p 3308:3306 --name mysql-latest -e MYSQL_ROOT_PASSWORD=toor -d mysql:latest  --default-authentication-plugin=mysql_native_password


## Results



```
Total: Total miliseconds took
Avg: Average milisecond duration per batch
batchSize: How many rows inserts each batch
Batches: How many batches were ran
Rows: Total rows inserted

```

####Mysql 5.6:

```
Uuid result: { 
  total: 10995,
  avg: 2.199,
  batchSize: 50,
  batches: 5000,
  rows: 250000 }
Numeric result: { 
  total: 9013,
  avg: 1.8026,
  batchSize: 50,
  batches: 5000,
  rows: 250000 }


Uuid result: { 
 total: 500366,
  avg: 10.00732,
  batchSize: 50,
  batches: 50000,
  rows: 2500000 }
Numeric result: {
  total: 131499,
  avg: 2.62998,
  batchSize: 50,
  batches: 50000,
  rows: 2500000 }

```

####Mysql 8.0.18:

```
Uuid result: { 
  total: 23539,
  avg: 4.7078,
  batchSize: 50,
  batches: 5000,
  rows: 250000 }
Numeric result: {
  total: 21264,
  avg: 4.2528,
  batchSize: 50,
  batches: 5000,
  rows: 250000 }


Uuid result: {
  total: 380339,
  avg: 7.60678,
  batchSize: 50,
  batches: 50000,
  rows: 2500000 }
Numeric result: {
  total: 247198,
  avg: 4.94396,
  batchSize: 50,
  batches: 50000,
  rows: 2500000 }


```

#### Misc:

Reading the comments on https://mysqlserverteam.com/mysql-8-0-uuid-support/, 
it looks like using those function the performance would be the same as using
numbers, the main problem is that no ORM handles the crappy MYSQL uuid functions,
and the MySQL team answered there saying they may implement it as a Data Type in the future.

