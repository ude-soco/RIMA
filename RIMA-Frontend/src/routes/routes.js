import Profile from "../views/Profile.js";
import Register from "../views/Register.js";
import Login from "../views/Login.js";
import AddPaper from "../views/AddPaper.js";
import ViewPaper from "../views/ViewPaper.js";
import EditPaper from "../views/EditPaper.js";
import CloudChartPage from "../views/CloudChart";
import ConceptChartPage from "../views/ConceptChart";
import StreamChartPage from "../views/StreamChart";
import SearchUserProfile from "../views/SearchUserProfile";
import Keyword from "../views/Keyword.js";
import BlacklistedKeywords from "../views/BlacklistedKeywords.js";
import Demo from "../views/Demo.js";
import LoginRedirecting from "../views/LoginRedirecting";
import PieChartPage from "../views/PieChart";
import BarChartPage from "../views/BarChart";

var routes = [
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
    name: "Add Paper",
    icon: "ni ni-fat-add text-green",
    component: AddPaper,
    layout: "/app",
    // display: "none"
  },
  {
    path: "/edit-paper/:id",
    name: "Edit Paper",
    icon: "ni ni-fat-add text-orange",
    component: EditPaper,
    layout: "/app",
    display: "none",
  },
  {
    path: "/view-paper",
    name: "My Papers",
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
    component: PieChartPage,
    layout: "/app",
    display: "none",
  },
  {
    path: "/bar-chart",
    name: "Bar Chart",
    icon: "fas fa-chart-bar text-pink",
    component: BarChartPage,
    layout: "/app",
    display: "none",
  },
  {
    path: "/cloud-chart",
    name: "Cloud Chart",
    icon: "fas fa-cloud text-info",
    component: CloudChartPage,
    layout: "/app",
    display: "none",
  },
  {
    path: "/concept-chart",
    name: "Concept Chart",
    icon: "fas fa-cloud text-info",
    component: ConceptChartPage,
    layout: "/app",
    display: "none",
  },
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
];
export default routes;
