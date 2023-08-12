import "../styles/reset.scss";
import "../styles/admin.scss";
import "../styles/layer.scss";
import api from "./lib/api";

let pageCount = 1;
let lastPageNum = 0;
let type = "all";
let data = {};
let userItems;
let columns = [
  { header: "닉네임", key: "name", width: 25 },
  { header: "점수", key: "score", width: 25 },
  { header: "연락처", key: "hp", width: 25 },
  { header: "이메일", key: "email", width: 25 },
  { header: "마케팅 수신 동의", key: "marketing", width: 25 },
  { header: "IP", key: "ip", width: 25 },
  {
    header: "등록날짜",
    key: "publishedDate",
    width: 30,
  },
];

window.onload = () => {
    
};
