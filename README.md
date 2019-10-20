repo_xyzabc123


Deployment:

MongoDB
1. Install MongoDB and add to PATH
2. Start mongod with data path:
    example:'mongod.exe --dbpath=data'

Server
1. Clone git repo
2. install node modules:
    'npm install'
3. Check and modify config file as needed
4. Run databaseFiller.js to add to local db: (not production-level, sometimes fails to exit on completion)
    'node src/databaseFiller.js'
4. Start server:
    'npm start' 

Testing:
1. npm test (TODO: tests currently don't tear down properly, need to ctrl-c when completed)
