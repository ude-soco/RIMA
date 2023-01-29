from neo4j import GraphDatabase

uri = "neo4j://127.0.0.1:7687"

userName = "neo4j"

password = "1234"

graphDB_Driver = GraphDatabase.driver(uri, auth=(
    userName, password))
