#### Ports used by WeVote developers in their local setups

| Server                                           |           Served by           | port | purpose                    |
|--------------------------------------------------|:-----------------------------:|-----:|:---------------------------|
| "WebApp" React webapp for voters                 |     webpack serve/express     | 3000 | Client App -- Voter facing |
| WeVoteServer (Python) API Server for "WebApp"    | django runserver/runsslserver | 8000 | API Server -- Python       |
| weconnect React webapp for staff                 |     webpack serve/express     | 4000 | Client App -- Staff facing | 
| weconnect-server (Node) API server for weconnect |            express            | 4500 | API Server -- Node         | 
| postgres local server                            |           postgres            | 5432 | Database Server            | 

