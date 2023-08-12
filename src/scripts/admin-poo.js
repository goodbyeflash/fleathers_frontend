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
  // api("get", "admins/check", undefined, (res) => {
  //   if (res) {
  //     if (res.msg && res.msg == "ERROR") {
  //       location.href = "admin.html";
  //       return;
  //     }
  //     document.getElementById("prev").onclick = () => {
  //       if (pageCount == 1) {
  //         return;
  //       } else {
  //         pageCount--;
  //         onloadUserTable();
  //       }
  //     };
  //     document.getElementById("next").onclick = () => {
  //       if (pageCount == lastPageNum) {
  //         return;
  //       } else {
  //         pageCount++;
  //         onloadUserTable();
  //       }
  //     };
  //     document.getElementById("findBtn").onclick = () => {
  //       data = {};
  //       data[document.getElementById("findSelect").value] =
  //         document.getElementById("findText").value;
  //       pageCount = 1;
  //       type = "find";
  //       window.sessionStorage.setItem("dodge_filter", JSON.stringify(data));
  //       onloadUserTable();
  //     };
  //     onloadUserTable();
  //     document.getElementById("findClear").onclick = () => {
  //       window.sessionStorage.clear("dodge_filter");
  //       document.getElementById("findText").value = "";
  //       pageCount = 1;
  //       data = {};
  //       type == "all";
  //       onloadUserTable();
  //     };
  //     document.getElementById("delete").onclick = () => {
  //       if (!confirm("정말 삭제하시겠습니까?")) {
  //         return;
  //       }
  //       api("delete", "users/list", {}, (res) => {
  //         if (res.msg && res.msg == "OK") {
  //           onloadUserTable();
  //         }
  //       });
  //     };
  //     document.getElementById("logout").onclick = () => {
  //       api("post", "admins/logout", {}, (res) => {
  //         if (res.msg && res.msg == "OK") {
  //           alert("로그아웃 되었습니다.");
  //           location.href = "admin.html";
  //         }
  //       });
  //     };
  //     document.getElementById("excel").onclick = () => {
  //       api(
  //         "post",
  //         "users/download",
  //         {
  //           columns: columns,
  //         },
  //         (res) => {
  //           const blob = new Blob([res.result.data], {
  //             type: res.result.headers["content-type"],
  //           });
  //           var a = document.createElement("a");
  //           a.href = window.URL.createObjectURL(blob);
  //           a.download = "데이터 리스트.xlsx";
  //           a.click();
  //         }
  //       );
  //     };
  //     document.getElementsByTagName("body")[0].style.display = "block";
  //   }
  // });
};

function onloadUserTable() {
  const table = document
    .getElementsByClassName("table")[0]
    .getElementsByTagName("tbody")[0];
  const filter = window.sessionStorage.getItem("dodge_filter");
  let method = type == "find" || filter ? "post" : "get";
  let url = type == "find" || filter ? "users/find" : "users/adminList";

  // 검색 된 필터 있을 경우
  if (filter) {
    data = JSON.parse(filter);
    const key = Object.keys(data)[0];
    const value = data[key];
    const selectOptions = [
      ...document.getElementById("findSelect").getElementsByTagName("option"),
    ];
    selectOptions.forEach((optionEl) => {
      if (optionEl.value == key) {
        optionEl.selected = true;
      }
    });
    document.getElementById("findText").value = value;
  }

  api(method, `${url}?page=${pageCount}`, data, (res) => {
    if (res) {
      if (res.msg && res.msg == "OK") {
        lastPageNum = res.result.headers["last-page"];
        userItems = res.result.data;
        table.innerHTML = "";
        userItems.forEach((item, index) => {
          table.innerHTML += `<tr>
            <td>${item.name}</td>
            <td>${item.score}</td>
            <td>${item.hp}</td>
            <td>${item.email}</td>
            <td>${item.marketing}</td>
            <td>${item.ip}</td>
            <td>${new Date(
              item.publishedDate
            ).YYYYMMDDHHMMSS()}</td>            
            <td>
            <label id="delete_${index}" data-val="${
            item._id
          }" class="btn btn-file">삭제</label></td>
            </tr>`;
        });

        for (let index = 0; index < userItems.length; index++) {
          document.getElementById(`delete_${index}`).onclick = (e) => {
            if (window.confirm("정말 삭제하시겠습니까?")) {
              api(
                "delete",
                `users/${e.target.getAttribute("data-val")}`,
                {},
                (res) => {
                  if (res.msg && res.msg == "ERROR") {
                    alert("오류가 발생하였습니다.");
                    return;
                  } else {
                    onloadUserTable();
                  }
                }
              );
            }
          };
        }
        document.getElementById("pageNav").innerText = `${
          lastPageNum > 0 ? pageCount : 0
        }/${lastPageNum}`;
      } else {
        console.log("[API] => 닷지 게임 전체 목록을 불러올 수 없습니다.");
      }
    }
  });
}

function pad(number, length) {
  var str = "" + number;
  while (str.length < length) {
    str = "0" + str;
  }
  return str;
}

Date.prototype.YYYYMMDDHHMMSS = function () {
  var yyyy = this.getFullYear().toString();
  var MM = pad(this.getMonth() + 1, 2);
  var dd = pad(this.getDate(), 2);
  var hh = pad(this.getHours(), 2);
  var mm = pad(this.getMinutes(), 2);
  var ss = pad(this.getSeconds(), 2);

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
};
