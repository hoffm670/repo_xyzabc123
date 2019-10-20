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

IDs in DB:
 [3860073, 13860070, 13860088, 13860115, 13860137, 13860141, 13860154, 13860185, 13860320, 13860322, 13860323, 13860321, 13860325, 13860329, 13860326, 13860327, 13860381, 13860380, 13860384, 13860383, 13860387, 13860385, 13860389, 13860379, 13860388, 13860390, 13860394, 13860396, 13860397, 13860382, 13860414, 13860416, 13860415, 13860420, 13860421, 13860419, 13860418, 13860417, 13860423, 13860428, 13860427, 13860429, 13860431, 13860424, 13860433, 13860432, 13860425, 13860516, 13860927, 13860931, 1386092]
