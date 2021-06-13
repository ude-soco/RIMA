import Profile from "../Views/Application/Settings/Profile/Profile";
import Login from "../Views/Website/Login/Login";
import AddPaper from "../Views/Application/Publications/Paper/AddPaper.jsx";
import ViewPaper from "../Views/Application/Publications/Paper/ViewPaper";
import EditPaper from "../Views/Application/Publications/Paper/EditPaper";
import InterestOverview from "../Views/Application/Dashboard/InterestOverview/InterestOverview";
import ConceptChartPage from "../Views/ConceptChart";
import StreamChartPage from "../Views/StreamChart";
import SearchUserProfile from "../Views/SearchUserProfile";
import Keyword from "../Views/Keyword.js";
import BlacklistedKeywords from "../Views/BlacklistedKeywords";
import Demo from "../Views/Website/Demo/Demo";
import LoginRedirecting from "../Views/Website/Login/LoginRedirecting";
import RecentInterest from "../Views/Application/Dashboard/RecentInterest/RecentInterest";
// import Activities from "../Views/Activities";
import TweetsAndPeople from "../Views/Application/Twitter/TweetsAndPeople";
import TopicFormPage from "../Views/Application/Conferences/Topic/TopicForm";
import TopicBar from "../Views/Application/Conferences/Topic/TopicBar";
import TopicComparisions from "../Views/Application/Conferences/Topic/TopicComparisions";
import AuthorVenn from "Views/components/LAKForms/AuthorVenn";
import RecommendTopic from "Views/RecommendTopic";
import TopicResearch from "Views/Application/Conferences/Topic/TopicResearch";
import TopicAuthors from "Views/Application/Conferences/Topic/TopicAuthors";
import Register from "../Views/Website/Register/Register";
import Dashboard from "../Views/Application/Dashboard/Dashboard";


let routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Dashboard,
    layout: "/app",
    display: "none",
  },
  {
    path: "/index",
    name: "Dashboard",
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
  // {
  //   path: "/bar-chart",
  //   name: "Bar Chart",
  //   icon: "fas fa-chart-bar text-pink",
  //   component: Activities,
  //   layout: "/app",
  //   display: "none",
  // },
  {
    path: "/cloud-chart",
    name: "Cloud Chart",
    icon: "fas fa-cloud text-info",
    component: InterestOverview,
    layout: "/app",
    display: "none",
  },
  // {
  //   path: "/concept-chart",
  //   name: "Concept Chart",
  //   icon: "fas fa-cloud text-info",
  //   component: ConceptChartPage,
  //   layout: "/app",
  //   display: "none",
  // },
  {
    path: "/stream-chart",
    name: "Stream Chart",
    icon: "fas fa-cloud text-info",
    component: StreamChartPage,
    layout: "/app",
    display: "none",
  },

  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-green",
    component: Profile,
    layout: "/app",
    display: "none",
  },
  {
    path: "/profile/:id",
    name: "User Account Details",
    icon: "ni ni-single-02 text-green",
    component: SearchUserProfile,
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
    component: TopicBar,
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

];
export default routes;
