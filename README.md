Project: Interactive Data Exploration and Analytics (IDEA) Lab SS 23 - Group Connect

Group Members: Emily Hunke, Ishkhan Serop, Philipp Krueger, Lukas Duda

Description: Improvements to the "Connect" page of the RIMA-Application based on the evaluation results of prior studies, aiming to reach the self-actualization-goal socialize.

1. Backend Layer:

	- Python method stores data provided by the Semantic Scholar API in a dictionary and returns it as an object

	- The data object gets passed to views.py where, using the data, a JSON file is generated and returned

2. Frontend Layer:

	- Frontend API fetches backend data, using a determined url that points to the data

	- Data arrived in frontend, where it is displayed or further used in methods


Libraries used: Python, JSON, HTML, CSS, Cytoscape, JavaScript, ReactJS, MaterialUI