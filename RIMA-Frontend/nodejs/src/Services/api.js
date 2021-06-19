import { getItem } from "./utils/localStorage";
import { BASE_URL } from "./constants";
import axios from "axios";

class RestAPI {
  static refreshData(data) {
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

  static refreshPaper(data) {
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
  static updateUserProfile(data, id) {
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

  //** PIE DATA API **//
  static pieChart(data) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/short-term/user/${getItem("userId")}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      keywords: data,
    }).then((res) => res);
  }
  //** PIE DATA API FOR USER PROFILE **//
  static pieChartUser(data) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/short-term/user/${getItem("mId")}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
      keywords: data,
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
  //** STREAM DATA API FOR USER PROFILE **//
  static streamChartUser() {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/stream-graph/user/${getItem("mId")}`,
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

  //** BAR DATA API FOR USER PROFILE **//
  static barChartUser(data) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/activity-stats/user/${getItem("mId")}`,
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

  //** CLOUD DATA API FOR USER PROFILE **//
  static cloudChartUser(data) {
    const TOKEN = getItem("accessToken");
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/long-term/user/${getItem("mId")}`,
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
  static dataImportStatus() {
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
