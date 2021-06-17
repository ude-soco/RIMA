import {BASE_URL} from "./constants";
import axios from "axios";
import {getUserInfo} from "./utils/functions";

const currentUser = getUserInfo();

class RestAPI {
  // SEARCH FOR USERS BY NAME TO COMPARE
  static searchAuthors(data) {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/accounts/user-search/${data}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res)
  }

  // LONG TERM INTEREST
  static longTermInterest(data) {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/long-term/user/${data.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  // SHORT TERM INTEREST
  static shortTermInterest(data) {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/short-term/user/${data.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }


  static refreshData() {
    return axios({
      method: "post",
      url: `${BASE_URL}/api/interests/trigger-data-updata/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
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
        Authorization: `Token ${currentUser.token}`,
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
    return axios({
      method: "post",
      url: `${BASE_URL}/api/interests/papers/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      data: data,
    }).then((res) => res);
  }

  //** GET LIST PAPER API **//
  static getListPaper() {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/papers/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  //** GET A PAPER API **//
  static getPaper(id) {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/papers/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  //** DELETE A PAPER API **//
  static deletePaper(id) {
    return axios({
      method: "DELETE",
      url: `${BASE_URL}/api/interests/papers/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  static deletekeyword(id) {
    return axios({
      method: "DELETE",
      url: `${BASE_URL}/api/interests/long-term/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  //** UPDATE PAPER API **//
  static updatePaper(data, id) {
    return axios({
      method: "patch",
      url: `${BASE_URL}/api/interests/papers/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      data: data,
    }).then((res) => res);
  }

  //** GET USER PROFILE DATA API **//
  static getUserData() {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/accounts/profile/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      //   data: data
    }).then((res) => res);
  }



  //** UPDATE USER PROFILE API **//
  static updateUserProfile(data) {
    return axios({
      method: "patch",
      url: `${BASE_URL}/api/accounts/profile/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      data: data,
    }).then((res) => res);
  }

  //** GET KEYWORD DATA API **//
  static getKeyword() {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/keywords/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      //   data: data
    }).then((res) => res);
  }

  //** ADD KEYWORD DATA API **//
  static addKeyword(data) {

    return axios({
      method: "post",
      url: `${BASE_URL}/api/interests/long-term/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },

      data: {
        keywords: data,
      },
    }).then((res) => res);
  }

  //** GET BLACK KEYWORD  API **//
  static getBlackKeyword() {

    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/black-listed-keywords/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      //   data: data
    }).then((res) => res);
  }

  //** ADD BLACK KEYWORD API **//
  static addBlackKeyword(data) {
    return axios({
      method: "post",
      url: `${BASE_URL}/api/interests/black-listed-keywords/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      data: {
        keywords: [data],
      },
    }).then((res) => res);
  }

  //** DELETE BLACK KEYWORD API **//
  static deleteBlackKeyword(id) {
    return axios({
      method: "delete",
      url: `${BASE_URL}/api/interests/black-listed-keywords/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  //** PIE DATA API **//
  static pieChart(data) {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/short-term/user/${currentUser.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      keywords: data,
    }).then((res) => res);
  }
  //** PIE DATA API FOR USER PROFILE **//
  static pieChartUser(data) {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/short-term/user/${currentUser.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      keywords: data,
    }).then((res) => res);
  }

  //** STREAM DATA API **//
  static streamChart() {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/stream-graph/user/${currentUser.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  //** STREAM DATA API FOR USER PROFILE **//
  static streamChartUser() {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/stream-graph/user/${currentUser.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  //** CONCEPT DATA API **//
  static conceptChart() {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/long-term/user/${currentUser.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  //** BAR DATA API **//
  static barChart(data) {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/activity-stats/user/${currentUser.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      keywords: data,
    }).then((res) => res);
  }

  //** BAR DATA API FOR USER PROFILE **//
  static barChartUser(data) {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/activity-stats/user/${currentUser.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      keywords: data,
    }).then((res) => res);
  }

  //** CLOUD DATA API **//
  static cloudChart(data) {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/long-term/user/${currentUser.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      keywords: data,
    }).then((res) => res);
  }

  //** CLOUD DATA API FOR USER PROFILE **//
  static cloudChartUser(data) {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/long-term/user/${currentUser.id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
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
    return axios({
      method: "get",
      url: `${BASE_URL}/api/accounts/public-profile/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  //** GET SCORE SEARCH USER PROFILE DATA API **//
  static getScore(id) {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/similarity/${id}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  //** GET DATA STATUS API **//
  static dataImportStatus() {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/accounts/data-import-status/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  // Tweets & People
  // Get tweets for tags
  static extractTweetsFromTags(data) {
    return axios({
      method: "POST",
      url: `${BASE_URL}/api/interests/recommended-tweets`,
      // url: `${BASE_URL}/api/interests/recommended-tweets/${getItem("userId")}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      data: data,
    }).then((res) => res);
  }

  static savedTweets(data) {
    return axios({
      method: "POST",
      url: `${BASE_URL}/api/interests/tweets`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
      data: data,
    }).then((res) => res);
  }

  static getSavedTweets() {
    return axios({
      method: "GET",
      url: `${BASE_URL}/api/interests/tweets`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  static hideSavedTweet(id) {
    return axios({
      method: 'DELETE',
      url: `${BASE_URL}/api/interests/tweets/${id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    })
  }

  // LAK Form
  static topicForm() {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/laktopics/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  //** STREAM DATA API FOR USER PROFILE **//
  static topicFormUser() {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/laktopics/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }

  //**added by mouadh */
  static getsimilartweets() {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/interests/getsimilarity/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${currentUser.token}`,
      },
    }).then((res) => res);
  }
}


export default RestAPI;
