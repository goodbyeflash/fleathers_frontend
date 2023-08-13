import "../styles/reset.scss";
import "../styles/admin.scss";
import "../styles/layer.scss";
import api from "./lib/api";

let pageCount = 1;
let lastPageNum = 0;
let type = "all";
let data = {};
let userItems;

window.onload = () => {
  api("get", "admin/check", undefined, (res) => {
    if (res) {
      if (res.msg && res.msg == "ERROR") {
        location.href = "admin.html";
        return;
      }
      document.getElementById("prev").onclick = () => {
        if (pageCount == 1) {
          return;
        } else {
          pageCount--;
          onloadPooTable();
        }
      };
      document.getElementById("next").onclick = () => {
        if (pageCount == lastPageNum) {
          return;
        } else {
          pageCount++;
          onloadPooTable();
        }
      };
      document.getElementById("findBtn").onclick = () => {
        if (!document.getElementById("findText").value) {
          return;
        }
        data = {};
        data[document.getElementById("findSelect").value] =
          document.getElementById("findText").value;
        pageCount = 1;
        type = "find";
        window.sessionStorage.setItem("poo_filter", JSON.stringify(data));
        onloadPooTable();
      };
      onloadPooTable();
      document.getElementById("findClear").onclick = () => {
        window.sessionStorage.clear("poo_filter");
        document.getElementById("findText").value = "";
        pageCount = 1;
        data = {};
        type == "all";
        onloadPooTable();
      };
      document.getElementById("clearBtn").onclick = () => {
        if (!confirm("초기화 하시겠습니까?")) {
          return;
        }
        api("delete", "poo/clear", {}, (res) => {
          if (res.msg && res.msg == "OK") {
            onloadPooTable();
          }
        });
      };
      document.getElementById("logout").onclick = () => {
        if (!confirm("로그아웃 하시겠습니까?")) {
          return;
        }
        api("post", "admin/logout", {}, (res) => {
          if (res.msg && res.msg == "OK") {
            location.href = "admin.html";
          }
        });
      };
      document.getElementsByTagName("body")[0].style.display = "block";
    }
  });
};

function onloadPooTable() {
  const table = document
    .getElementsByClassName("table")[0]
    .getElementsByTagName("tbody")[0];
  const findClearBtn = document.getElementById("findClear");
  const filter = window.sessionStorage.getItem("poo_filter");
  let method = type == "find" || filter ? "post" : "get";
  let url = type == "find" || filter ? "poo/find" : "poo/";

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

  findClearBtn.style.opacity = filter ? 1 : 0.3;
  findClearBtn.disabled = filter ? false : true;
  findClearBtn.style.pointerEvents = filter ? "auto" : "none";

  api(method, `${url}?page=${pageCount}`, data, (res) => {
    if (res) {
      if (res.msg && res.msg == "OK") {
        lastPageNum = res.result.headers["last-page"];
        userItems = res.result.data;
        table.innerHTML = "";
        userItems.forEach((item, index) => {
          table.innerHTML += `<tr>
            <td>${item.serialNum}</td>
            <td>${item.name}</td>
            <td>${item.score}</td>
            <td>${item.playTime}</td>
            <td>${item.playCount}</td>
            <td>${item.ip}</td>
            <td>${new Date(
              item.publishedDate
            ).YYYYMMDDHHMMSS()}</td>            
            <td>
            <a id="clear_${index}" data-val="${
            item._id
          }" class="btn btn-secondary">점수 초기화</a>
            <label id="delete_${index}" data-val="${
            item._id
          }" class="btn btn-file">삭제</label></td>
            </tr>`;
        });

        for (let index = 0; index < userItems.length; index++) {
          document.getElementById(`clear_${index}`).onclick = (e) => {
            if (window.confirm("초기화 하시겠습니까?")) {
              api(
                "patch",
                `poo/${e.target.getAttribute("data-val")}`,
                {
                  score: 0,
                },
                (res) => {
                  if (res.msg && res.msg == "ERROR") {
                    alert("오류가 발생하였습니다.");
                    return;
                  } else {
                    onloadPooTable();
                  }
                }
              );
            }
          };

          document.getElementById(`delete_${index}`).onclick = (e) => {
            if (window.confirm("삭제하시겠습니까?")) {
              api(
                "delete",
                `poo/${e.target.getAttribute("data-val")}`,
                {},
                (res) => {
                  if (res.msg && res.msg == "ERROR") {
                    alert("오류가 발생하였습니다.");
                    return;
                  } else {
                    onloadPooTable();
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
        console.log("[API] => 똥피하기 게임 전체 목록을 불러올 수 없습니다.");
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
