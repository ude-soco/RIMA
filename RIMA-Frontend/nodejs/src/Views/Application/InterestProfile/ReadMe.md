This file is intended to give context to the code that I (Alptug) have written but could not finish.
Inside you can find all the resources that I have used, and Todos that are still left.


In general, all of this work is based on the prototypes that were developed during my thesis, which can be found here:
https://www.figma.com/file/wI8UhSvLpqK9feNJwZXtho/RIMA?node-id=827%3A6174
https://www.figma.com/proto/wI8UhSvLpqK9feNJwZXtho/RIMA?node-id=503%3A67&scaling=min-zoom&page-id=503%3A67&starting-point-node-id=827%3A6174&show-proto-sidebar=1


Since the overall structure of the prototypes consists of tabs, we first need the logic for the tabs.
This can be found in "InterestProfileNew". We use the "Tabs" component from MUI https://v4.mui.com/components/tabs/#tabs to call every component.
The single components can be found as seperate files under the "..InterestProfile/Tabs" folder.

Since the first tab of the prototypes consists of a carousel with three different visualizations, first we need a carousel.
In the "InterestOverviewNew" file, the logic for the carousel component can be found.
For this, the library "react-awesome-slider" was used. https://github.com/rcaferati/react-awesome-slider

In line 29 of "InterestOverviewNew" we define the items as the three charts: let items = [<CloudChart/>, <BarChart/>, <CirclePackingExample/>].
After that we return these items inside of the slider component.

For the cloud chart, the component that was already there was reused.

The Bar chart can be found under "InterestProfile/Tabs/BarChart". It is based on Apex-Charts.
 Currently it is static data, and not the actual interests of a user.
For the events that happen in the Prototypes we need a way to handle events like user- clicking/hovering. 
For this I suggest using the "dataPointSelection" which recognizes when a user clicks on a data point of the chart.
Read more here https://apexcharts.com/docs/options/chart/events/#click 
Also I have tried this with a simple example in this sandbox: https://codesandbox.io/s/swiping-charts-lricdt?file=/src/BarChart.jsx
console.log(config); prints the config object where the data can be found.  
console.log(config.w.config.xaxis.categories[config.selectedDataPoints]); prints, for example the data of the bar chart that was clicked.
Looking at the "w" object, we can get any data like this, that we need from the chart.

The Circlepacking visualization is based on the nivo library: https://nivo.rocks/circle-packing/
Like with the Bar chart, the data in it is currently simply dummy data, and not the actual interests of the user.
For an example to play around with it, one can use the following CodeSandBox: https://codesandbox.io/s/circlepacking-141jrx

For the "How Does It Work?" component we use the MUI component Stepper. It can be found in "Tabs/HowDoesItWork".
Like in the prototype, this stepper is divided into 5 steps.
In the first step, we fetch the Semantic Scholar ID and the Twitter ID of the user and present them.
In the second step, we show the recent publications and tweets. Here we call the component "ActivitiesNew". The only difference to the "Activities"
component that already exists is, that I do not use a "Card" component in "ActivitesNew", because it is shown inside of a Stepper component.
In the third and fourth step, we need a way to represent the keywords of the user and then the steps of the merging and normalizing. At the moment I do not have any implementation for this. 
I suggest using the following library for this:  https://reactflow.dev/
I played around a bit with the framework in the following Sandboxes: https://codesandbox.io/s/keywords-88zuxg  and https://codesandbox.io/s/keywords-merged-normalized-0wsk3u
The coloring and details can be adjusted also.

Lastly, in "Tabs/MyInterests" I tried to show a skeleton for a dialog for editing user interests.  
I wanted it to look like the dialog that pops up when you click on "Manage Interests" in the following Sandbox: 
https://codesandbox.io/s/dashboard-with-tabs-ykw76t?file=/MyInterests.jsx
Then a dialog with two sliders should pop up.
In "Tabs/MyInterests" the dialog does not show up, and the styling needs to be adjusted.
If you want to do the dialog from scratch, I suggest commenting or deleting line 55-118 in "MyInterests.jsx".

The remaining part are Todos that are left, and for some I will leave personal suggestions that could be worth investigating.

TODOS:

Tab "My Interest":
- "Manage Interests" modal and "Edit" for User editing his own preferences

Word Cloud:
-  Change on click on a word to menu like in the prototype
- "Similar Interests" modal
-  Change "Why this interest?" modal into new one

Barchart: 
- Fetch real user data from Backend
- On click on a bar a menu shows up, with the three buttons like in prototype
- "Similar Interests" modal
- Change "Why this interest?" modal into new one

Circle packing:
- Fetch real user data from backend
- On click on a circle a menu shows up, with the three buttons like in prototype
- "Similar Interests" modal
- Change "Why this interest?" modal into new one

Tab Explore:
- Same functionality like in prototype, no work done yet.
- Includes: 
- Learn more (Show paragraph from wikipedia definition), 
- Add to interests (add it to the profile), 
- Expand (show more similar things)
- Similarity scores: Show the similarity scores when hovering over the edges, e.g., "Similarity to Learning: 65%"
- Filter interests: A filter that decides which interests should be used in this visualization

Tab Discover: 
- Same functionality as in prototypes, no work done yet.
- Includes:
- Learn more (same as in explore)
- Add to my interests (same as in explore)
- Remove - (Here we decided to have a list or page somewhere with blacklisted words, that were deleted. In case the user wants to add them again)
- Filter interests: (same as in explore)
- Field of study: Filtering the fields of studies that should be included
- 

Connect:
- No work done yet:
- Initial visualization needed - Authors who cited me and who I cited from Semantic Scholar API.
- Initial vis is inspired by semantic scholar. When you go to the page of an author and click on the "influence" tab, you can see their version of it
- "Where am I cited?" Upon clicking on an author - Shows where a specific author has cited me. Ordering them by clicking on "Year" or "Title" was stated as preference of users
- "Where did I cite?" Upon clicking on an author - shows where I cited this person. Same modal/accordion structure as in "Where am I cited?"
- "Compare Interests" Venn diagram which shows common and uncommon interests between two authors - Interactivity (on hover show weights) and on click (learn more + add to interests) was suggested by users
- Additionally, and this is not included in the prototypes: "View profile" after clicking on a user was mentioned as a part of this menu
- For the initial visualization I suggest using: reactflow.dev. I think using custom nodes can make this visualization possible: https://reactflow.dev/docs/guides/custom-nodes/    https://reactflow.dev/docs/examples/custom-node/

How does it Work:
- Save keywords in backend and fetch them to show in step 3 and 4
- I suggest showing them, as mentioned with reactflow. Here are again two examples with dummy data :
https://codesandbox.io/s/keywords-88zuxg  and https://codesandbox.io/s/keywords-merged-normalized-0wsk3u
- When I tried to show them in the step, it somehow didn't work. It needs to be investigated how to include these react-flow charts.