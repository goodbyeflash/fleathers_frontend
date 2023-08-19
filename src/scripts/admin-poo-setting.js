import "../styles/reset.scss";
import "../styles/admin.scss";
import "../styles/layer.scss";
import api from "./lib/api";

window.onload = () => {
  api("get", "admin/check", undefined, (res) => {
    if (res) {
      if (res.msg && res.msg == "ERROR") {
        location.href = "admin.html";
        return;
      } else {
        api("get", "poo_opt", undefined, (res) => {
          if (res.msg == "OK") {
            const data = res.result.data[0];
            for (const key in data.assets) {
              if (Object.hasOwnProperty.call(data.assets, key)) {
                const asset = data.assets[key];
                const sizeEl = document.getElementById(`${key}Size`);
                const imgEl = document.getElementById(`${key}Thumb`);

                sizeEl.innerText = `(${asset.size.width}*${asset.size.height})`;
                sizeEl.style.fontSize = "1.3rem";

                imgEl.innerHTML = `<img src='${asset.imgUrl}' />`;
                imgEl.style.background = "";
              }
            }

            for (const key in data) {
              if (Object.hasOwnProperty.call(data, key)) {
                if (key != "_id" && key != "__v" && key != "assets") {
                  document.getElementById(`${key}Txt`).value = data[key];
                }
              }
            }

            document.getElementById("saveBtn").onclick = () => {
              api(
                "patch",
                `poo_opt/${data._id}`,
                {
                  playerSpeed: document.getElementById("playerSpeedTxt").value,
                  spawnTime: document.getElementById("spawnTimeTxt").value,
                  gravity: document.getElementById("gravityTxt").value,
                  score: document.getElementById("scoreTxt").value,
                },
                (res) => {
                  if (res.msg == "OK") {
                    alert("저장 되었습니다.");
                  } else {
                    alert("오류가 발생하였습니다.");
                    console.error(res.result);
                  }
                }
              );
            };
          }
        });

        document.addEventListener("change", (e) => {
          const target = e.target;
          if (target.type == "file") {
            const file = target.files[0];
            const formData = new FormData();
            formData.append("img", file);
            api("post", `upload/poo/${target.name}`, formData, (res) => {
              if (res.msg == "ERROR") {
                alert("*.png 파일만 업로드가 가능합니다.");
              }
              window.location.reload();
            });
          }
        });

        document.body.style.display = "block";
      }
    }
  });
};
