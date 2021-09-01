import axios from "axios";
import {BASE_URL} from "./constants";
import {getItem} from "./utils/localStorage";


class RestAPI {
  // SEARCH FOR USERS BY NAME TO COMPARE
  static searchAuthors(userName) {
    let user = JSON.parse(localStorage.getItem("rimaUser"));
    return axios({
      method: "get",
      url: `${BASE_URL}/api/accounts/user-search/${userName}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${user.token}`,
      },
    }).then((res) => res)
  }

  // LONG TERM INTEREST
  static longTermInterest(userData) {
    let currentUser = JSON.parse(localStorage.getItem("rimaUser"));

    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/long-term/user/${!userData ? currentUser.id : userData.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  // SHORT TERM INTEREST
  static shortTermInterest(userData) {
    let currentUser = JSON.parse(localStorage.getItem("rimaUser"));
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/short-term/user/${!userData ? currentUser.id : userData.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  static interestTrends(userData) {
    let currentUser = JSON.parse(localStorage.getItem("rimaUser"));
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/stream-graph/user/${!userData ? currentUser.id : userData.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  static activities(userData) {
    let currentUser = JSON.parse(localStorage.getItem("rimaUser"));
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/activity-stats/user/${!userData ? currentUser.id : userData.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      }
    }).then((res) => res);
  }


  // OLD APIS

  static refreshData() {
    return axios({
      method: "post",
      url: `${BASE_URL}/api/interests/trigger-data-updata/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${getItem("accessToken")}`,
      },
      data: {},
    }).then((res) => res);
  }

  static refreshPaper() {
    return axios({
      method: "post",
      url: `${BASE_URL}/api/interests/trigger-paper-updata/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${getItem("accessToken")}`,
      },
      data: {},
    }).then((res) => res);
  }

  //** SIGNUP API **//
  static userSignup(data) {
    return axios({
      method: "post",
      url: `${BASE_URL}/api/accounts/register/`,
      data: data,
    }).then((res) => res);
  }

  //** SIGNUP API **//
  static userSignIn(data) {
    return axios({
      method: "post",
      url: `${BASE_URL}/api/accounts/login/`,
      data: data,
    }).then((res) => res);
  }

  //** ADD PAPER API **//
  static addPaper(data) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "post",
      url: `${BASE_URL}/api/interests/papers/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      data: data,
    }).then((res) => res);
  }


  //** ADD CONFERENCE API  BAB**//
  static addConference(data) {
    const TOKEN = getItem("accessToken");
    console.log(data);
    return axios({
      method: "post",
      url: `${BASE_URL}/api/conferences/addConference/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      data: data,
    }).then((res) => res);
  }
  //** GET LIST Conferences API  BAB**//
  static getListConference() {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/conferences/addConference/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  //** GET LIST Conferences API  BAB**//
  static getConferencesNames() {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/conferences/conferencesNames/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  //** GET LIST Conferences API  BAB**//
  static getListConferenceAuthors(conference_name_abbr) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/conferences/conferenceAuthors/${conference_name_abbr}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  
//** GET LIST PUBLICATIONS OF AN AUTHOR WITHIN A CONFERENCE  **//
static getListPublications(conference_name_abbr,author_id) {
  const TOKEN = getItem("accessToken");
  return axios({
    method: "get",
    url: `${BASE_URL}/api/conferences/AuthorPublication/${conference_name_abbr}/${author_id}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${TOKEN}`,
    },
  }).then((res) => res);
}



  //** GET LIST Conference Events API  BAB**//
  static getListConfercneEvents(conference_name_abbr) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/conferences/ConferenceEvents/${conference_name_abbr}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  
//** COLLECT PAPERS FOR AN EVENT **//

  static collectEventPapers(conference_name_abbr,conference_event_name_abbr) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/conferences/collectEventPapers/${conference_name_abbr}/${conference_event_name_abbr}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }


 //** EXTRACT TRENDS OF AN EVENT **//
  static ExtractEventTrends(conference_event_name_abbr) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/conferences/ExtractEventTrends/${conference_event_name_abbr}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }
  

  //** EXTRACT TRENDS OF THE AUTHORS OF AN EVENT **//
  static ExtractAuthorsTrends(conference_event_name_abbr) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/conferences/ExtractAuthorsTrends/${conference_event_name_abbr}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  //** GET LIST PAPER API **//
  static getListPaper() {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/papers/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  //** GET A PAPER API **//
  static getPaper(id) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/papers/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  //** DELETE A PAPER API **//
  static deletePaper(id) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "DELETE",
      url: `${BASE_URL}/api/interests/papers/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }



  //** DELETE A CONFERENCE API **//
  static deleteConference(conference_name_abbr) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "DELETE",
      url: `${BASE_URL}/api/conferences/conference/${conference_name_abbr}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  static deletekeyword(id) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "DELETE",
      url: `${BASE_URL}/api/interests/long-term/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  //** UPDATE PAPER API **//
  static updatePaper(data, id) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "patch",
      url: `${BASE_URL}/api/interests/papers/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      data: data,
    }).then((res) => res);
  }

  //** GET USER PROFILE DATA API **//
  static getUserData() {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/accounts/profile/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      //   data: data
    }).then((res) => res);
  }

  //** UPDATE USER PROFILE API **//
  static updateUserProfile(data) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "patch",
      url: `${BASE_URL}/api/accounts/profile/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      data: data,
    }).then((res) => res);
  }

  //** GET KEYWORD DATA API **//
  static getKeyword() {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/keywords/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      //   data: data
    }).then((res) => res);
  }

  //** ADD KEYWORD DATA API **//
  static addKeyword(data) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "post",
      url: `${BASE_URL}/api/interests/long-term/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },

      data: {
        keywords: data,
      },
    }).then((res) => res);
  }

  //** GET BLACK KEYWORD  API **//
  static getBlackKeyword() {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/black-listed-keywords/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      //   data: data
    }).then((res) => res);
  }

  //** ADD BLACK KEYWORD API **//
  static addBlackKeyword(data) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "post",
      url: `${BASE_URL}/api/interests/black-listed-keywords/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      data: {
        keywords: [data],
      },
    }).then((res) => res);
  }

  //** DELETE BLACK KEYWORD API **//
  static deleteBlackKeyword(id) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "delete",
      url: `${BASE_URL}/api/interests/black-listed-keywords/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  //** STREAM DATA API **//
  static streamChart() {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/stream-graph/user/${getItem("userId")}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  //** CONCEPT DATA API **//
  static conceptChart() {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/long-term/user/${getItem("userId")}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  //** BAR DATA API **//
  static barChart(data) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/activity-stats/user/${getItem("userId")}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      keywords: data,
    }).then((res) => res);
  }

  //** CLOUD DATA API **//
  static cloudChart(data) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/long-term/user/${getItem("userId")}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      keywords: data,
    }).then((res) => res);
  }

  //** POST API FOR INTEREST EXTRACTION **//
  static interestExtract(data) {
    return axios({
      method: "post",
      url: `${BASE_URL}/api/interests/interest-extraction/`,
      headers: {
        "Content-Type": "application/json",
        // Accept: "application/json",
      },
      data: data,
    }).then((res) => res);
  }

  static computeSimilarity(data) {
    return axios({
      method: "post",
      url: `${BASE_URL}/api/interests/similarity/`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }).then((res) => res);
  }

  //** GET SEARCH USER PROFILE DATA API **//
  static getUserProfile(id) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/accounts/public-profile/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  //** GET SCORE SEARCH USER PROFILE DATA API **//
  static getScore(id) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/similarity/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  //** GET DATA STATUS API **//
  static dataImportstatus() {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/accounts/data-import-status/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  // Tweets & People
  // Get tweets for tags
  static extractTweetsFromTags(data) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "POST",
      url: `${BASE_URL}/api/interests/recommended-tweets`,
      // url: `${BASE_URL}/api/interests/recommended-tweets/${getItem("userId")}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      data: data,
    }).then((res) => res);
  }

  static savedTweets(data) {
    const TOKEN = getItem("accessToken");

    return axios({
      method: "POST",
      url: `${BASE_URL}/api/interests/tweets`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      data: data,
    }).then((res) => res);
  }

  static getSavedTweets() {
    const TOKEN = getItem("accessToken");

    return axios({
      method: "GET",
      url: `${BASE_URL}/api/interests/tweets`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  static hideSavedTweet(id) {
    const TOKEN = getItem("accessToken");

    return axios({
      method: 'DELETE',
      url: `${BASE_URL}/api/interests/tweets/${id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    })
  }

  //LAK Form
  static topicForm() {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/laktopics/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

  //** STREAM DATA API FOR USER PROFILE **//
  static topicFormUser() {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/laktopics/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }

//**added by mouadh */
  static getsimilartweets() {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/getsimilarity/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then((res) => res);
  }
}


export default RestAPI;
