import Profile from "../Views/Application/Settings/Profile/Profile";
import Login from "../Views/Website/Login/Login";
import AddPaper from "../Views/Application/Publications/Function1/Paper/AddPaper.jsx";
import ViewPaper from "../Views/Application/Publications/Function1/Paper/ViewPaper";
import EditPaper from "../Views/Application/Publications/Function1/Paper/EditPaper";
// import InterestOverview from "../Views/Application/InterestProfile/InterestOverview/InterestOverview";
import ConceptChartPage from "../Views/Application/InterestProfile/PotentialInterests/PotentialInterests";
import Keyword from "../Views/Keywords";
import BlacklistedKeywords from "../Views/BlacklistedKeywords";
import Demo from "../Views/Website/Demo/Demo";
import LoginRedirecting from "../Views/Website/Login/LoginRedirecting";
import RecentInterest from "../Views/Application/InterestProfile/RecentInterest/RecentInterest";
// import Activities from "../Views/Activities";
import TweetsAndPeople from "../Views/Application/Twitter/TweetsAndPeople";
// import PublicationRecommendation from "../Views/Application/Publications/Recommendation/Publications";
import PublicationRec from "../Views/Application/Publications/PublicationRec";
import TopicFormPage from "../Views/Application/Conferences/Topic/TopicForm";
import ConferenceBar from "../Views/Application/Conferences/Topic/ConferenceBar";
import TopicComparisions from "../Views/Application/Conferences/Topic/TopicComparisions";
// import AuthorVenn from "Views/components/LAKForms/AuthorVenn";
import RecommendTopic from "Views/RecommendTopic";
import TopicResearch from "Views/Application/Conferences/Topic/TopicResearch";
import TopicAuthors from "Views/Application/Conferences/Topic/TopicAuthors";
import Register from "../Views/Website/Register/Register";
import InterestProfile from "../Views/Application/InterestProfile/InterestProfile";
import CompareAuthors from "../Views/Application/CompareAuthors/CompareAuthors";

import addConference from "../Views/Application/Conferences/addConference.jsx";
import viewConference from "../Views/Application/Conferences/viewConference.js";
import authorDashboard from "../Views/Application/Conferences/authorDashboard.js";
import compareConferences from "Views/Application/Conferences/Topic/compareConferences";
import ExplorePublications from "../Views/Application/ConferenceInsights/ExplorePublications/ExplorePublications";
import ExploreAuthorsNetwork from "../Views/Application/ConferenceInsights/ExploreAuthorsNetwork/ExploreAuthorsNetwork";
import PaperExplorerDashboard from "../Views/Application/PaperExplorer/PaperExplorerDashboard";

let routes = [
  {
    path: "/interest-profile",
    name: "InterestProfile",
    icon: "ni ni-tv-2 text-primary",
    component: InterestProfile,
    layout: "/app",
    display: "none",
  },
  {
    path: "/compare-authors",
    name: "CompareAuthors",
    icon: "ni ni-tv-2 text-primary",
    component: CompareAuthors,
    layout: "/app",
    display: "none",
  },
  {
    path: "/index",
    name: "InterestProfile",
    icon: "ni ni-tv-2 text-primary",
    component: ViewPaper,
    layout: "/app",
    display: "none",
  },
  {
    path: "/add-paper",
    name: "Add Publication",
    icon: "ni ni-fat-add text-green",
    component: AddPaper,
    layout: "/app",
    // display: "none"
  },
  // BAB
  {
    path: "/add-conference",
    name: "Add Conference",
    icon: "ni ni-fat-add text-green",
    component: addConference,
    layout: "/app",
    // display: "none"
  },
  // BAB
  {
    path: "/view-conference",
    name: "My Conferences",
    icon: "ni ni-fat-add text-green",
    component: viewConference,
    layout: "/app",
    // display: "none"
  },
  // BAB
  {
    path: "/compareConferences",
    name: "Conferences Compare",
    icon: "ni ni-fat-add text-green",
    component: compareConferences,
    layout: "/app",
    // display: "none"
  },
  // Explore publications under Conference Insights
  {
    path: "/exploreAuthors",
    name: "Explore Authors Network",
    icon: "ni ni-fat-add text-green",
    component: ExploreAuthorsNetwork,
    layout: "/app",
    // display: "none"
  },
  {
    path: "/explorePublications",
    name: "Explore Publications",
    icon: "ni ni-fat-add text-green",
    component: ExplorePublications,
    layout: "/app",
    // display: "none"
  },
  {
    path: "/view-author",
    name: "Conferences Authors",
    icon: "ni ni-fat-add text-green",
    component: authorDashboard,
    layout: "/app",
    // display: "none"
  },
  {
    path: "/edit-paper/:id",
    name: "Edit Publication",
    icon: "ni ni-fat-add text-orange",
    component: EditPaper,
    layout: "/app",
    display: "none",
  },
  {
    path: "/view-paper",
    name: "My Publications",
    icon: "fas fa-tasks text-blue",
    component: ViewPaper,
    layout: "/app",
    // display: "none"
  },

  {
    path: "/keyword",
    name: "Keyword",
    icon: "ni ni-archive-2 text-yellow",
    component: Keyword,
    layout: "/app",
    display: "none",
  },
  {
    path: "/blacklisted-keywords",
    name: "Blacklisted Keyword",
    icon: "ni ni-archive-2 text-brown",
    component: BlacklistedKeywords,
    layout: "/app",
    display: "none",
  },

  {
    path: "/pie-chart",
    name: "Pie Chart",
    icon: "fas fa-chart-pie text-orange",
    component: RecentInterest,
    layout: "/app",
    display: "none",
  },
  // TODO: to be removed
  // {
  //   path: "/bar-chart",
  //   name: "Bar Chart",
  //   icon: "fas fa-chart-bar text-pink",
  //   component: Activities,
  //   layout: "/app",
  //   display: "none",
  // },
  // {
  //   path: "/cloud-chart",
  //   name: "Cloud Chart",
  //   icon: "fas fa-cloud text-info",
  //   component: InterestOverview,
  //   layout: "/app",
  //   display: "none",
  // },
  // {
  //   path: "/concept-chart",
  //   name: "Concept Chart",
  //   icon: "fas fa-cloud text-info",
  //   component: ConceptChartPage,
  //   layout: "/app",
  //   display: "none",
  // },

  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-green",
    component: Profile,
    layout: "/app",
    display: "none",
  },
  {
    path: "/twitter-scanner/:id",
    name: "Tweets & People",
    icon: "fas fa-bars text-primary",
    component: TweetsAndPeople,
    layout: "/recommendation",
    // display: "none",
  },
  {
    path: "/publication",
    name: "Publications Recommenation",
    icon: "fas fa-bars text-primary",
    component: PublicationRec,
    // component: PublicationRecommendation,
    layout: "/recommendation",
    // display: "none",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
    display: "none",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
    display: "none",
  },
  {
    path: "/demo",
    name: "Demo",
    icon: "ni ni-circle-08 text-pink",
    component: Demo,
    layout: "/auth",
    display: "none",
  },
  {
    path: "/redirect",
    component: LoginRedirecting,
    layout: "/app",
    display: "none",
  },
  {
    path: "/topicform",
    component: TopicFormPage,
    layout: "/app",
    display: "none",
  },
  {
    path: "/topicbar",
    component: ConferenceBar,
    layout: "/app",
    display: "none",
  },
  {
    path: "/topicscompare",
    component: TopicComparisions,
    layout: "/app",
    display: "none",
  },
  {
    path: "/topicsrecommend",
    component: RecommendTopic,
    layout: "/app",
    display: "none",
  },
  {
    path: "/topicsresearch",
    component: TopicResearch,
    layout: "/app",
    display: "none",
  },
  {
    path: "/topicsauthors",
    component: TopicAuthors,
    layout: "/app",
    display: "none",
  },
  {
    path: "/paper-explorer",
    component: PaperExplorerDashboard,
    layout: "/app",
    display: "none",
  },
];
export default routes;
