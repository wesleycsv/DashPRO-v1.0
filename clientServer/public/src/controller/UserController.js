class UserController {
  constructor(formCreate, formUpdate, table) {
    this.formEl = document.getElementById(formCreate);
    this.formUpdateEl = document.getElementById(formUpdate);
    this.alvo = document.getElementById(table);
    this.graficoTwon();
    this.graficoOne();
    this.onEdit();
    this.onSubmit();
    this.allHtmlTr();
  }
  onEdit() {
    this.formUpdateEl
      .querySelector("#btnCancela")
      .addEventListener("click", (e) => {
        e.preventDefault();
        this.hiddenFormUpdate();
      });

    this.formUpdateEl.addEventListener("submit", (e) => {
      e.preventDefault();

      let value = this.getValues(this.formUpdateEl);
      let index = this.formUpdateEl.dataset.trIndex;
      let tr = this.alvo.rows[index];

      let userOld = JSON.parse(tr.dataset.user);
      let result = Object.assign({}, userOld, value);

      this.SetFoto(this.formUpdateEl)
        .then((content) => {
          if (!value._foto) {
            result._foto = userOld._foto;
          } else {
            result._foto = content;
          }

          let user = new User();
          user.loadFromJson(result);
          user.save().then((user) => {
            this.getTR(user, tr);

            this.formUpdateEl.reset();
            this.atualizarEstatistica();
            this.hiddenFormUpdate();
          });
        })
        .catch((error) => {
          console.log("wesley" + error);
        });
    });
  }
  onSubmit() {
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();

      const btnSalvar = this.formEl.querySelector(".btn-salva");
      btnSalvar.disabled = false;

      let value = this.getValues(this.formEl);
      if (!value) return false;

      this.SetFoto(this.formEl)
        .then((content) => {
          value.foto = content;
          value.save().then((user) => {
            this.showHtmlTr(user);
            this.removeErrorValidate();
            this.formEl.reset();
            btnSalvar.disabled = false;
          });
        })
        .catch((error) => {
          console.log("wesley" + error);
          btnSalvar.disabled = false;
        });
    });
  }
  allHtmlTr() {
    HttpRequest.get("/users").then((data) => {
      data.forEach((item) => {
        let user = new User();
        user.loadFromJson(item);
        this.showHtmlTr(user);
      });
    });
  }
  SetFoto(formulario) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      let fotoSelecionada = [...formulario.elements].filter((item) => {
        if (item.name === "foto") return item;
      });
      let foto = fotoSelecionada[0].files[0];

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      if (foto) {
        fileReader.readAsDataURL(foto);
      } else {
        resolve("./src/img/boxed-bg.jpg");
      }
    });
  }

  removeErrorValidate() {
    [...this.formEl.elements].forEach((item) => {
      item.classList.remove("input-error");
    });
  }

  getValues(formulario) {
    let data = {};
    let isInValid = true;

    [...formulario.elements].forEach((user) => {
      if (["name", "email", "senha"].indexOf(user.name) > -1 && !user.value) {
        user.classList.add("input-error");
        isInValid = false;
        return false;
      }

      if (user.name === "genero") {
        if (user.checked) {
          data[user.name] = user.value;
        }
      } else if (user.name === "admin") {
        data[user.name] = user.checked;
      } else if (user.name === "status") {
        data[user.name] = user.checked;
      } else {
        data[user.name] = user.value;
      }
    });
    if (!isInValid) {
      return false;
    }
    return new User(
      data.name,
      data.email,
      data.genero,
      data.nascimento,
      data.pais,
      data.senha,
      data.foto,
      data.admin,
      data.status
    );
  }
  showHtmlTr(values) {
    let tr = this.getTR(values);

    this.alvo.appendChild(tr);
    this.atualizarEstatistica();
  }

  getTR(values, tr = null) {
    if (tr == null) tr = document.createElement("tr");

    tr.dataset.user = JSON.stringify(values);

    tr.innerHTML = `
    <td><img class="foto-avatar" src="${values.foto}" /></td>
    <td>${values.name}</td>
    <td>${values.email}</td>
    <td>${values.admin ? "SIM" : "NÃO"}</td>
    <td>${
      values.status
        ? "<span class='userAtivo'>Ativo</span>"
        : "<span class='userIantivo'>Inativo</span>"
    }</td>
    <td>${Utils.formatDate(values.register)}</td>
    <td>
      <button class="btn-user-editar" id="editar-user">
        <i class="bi bi-person-gear"></i>
      </button>
      <button class="btn-user-excluir" id="excluirUser">
        <i class="bi bi-person-fill-x"></i>
      </button>
    </td>`;
    this.editaFormUser(tr);
    return tr;
  }

  editaFormUser(tr) {
    tr.querySelector("#excluirUser").addEventListener("click", () => {
      if (confirm("Deseja realmente excluir o usuário?")) {
        let user = new User();
        user.loadFromJson(JSON.parse(tr.dataset.user));
        user.remove().then((data) => {
          tr.remove();
          this.atualizarEstatistica();
        });
      }
    });

    tr.querySelector("#editar-user").addEventListener("click", () => {
      const json = JSON.parse(tr.dataset.user);
      const form = document.querySelector("#form-create-user-update");
      this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

      for (let idJson in json) {
        let field = form.querySelector(`[name=${idJson.replace("_", "")}]`);

        if (field) {
          switch (field.type) {
            case "file":
              continue;
              break;
            case "radio":
              field = form.querySelector(
                `[name="${idJson.replace("_", "")}"][value="${json[
                  idJson
                ].replace("_", "")}"]`
              );
              field.checked = true;
              break;
            case "checkbox":
              field.checked = json[idJson];
              break;
            default:
              field.value = json[idJson];
          }
          field.value = json[idJson];
        }
      }
      this.formUpdateEl.querySelector(".foto-avatar").src = json._foto;
      this.showForm();
    });
  }

  showForm() {
    document.querySelector("#create-user").style.display = "none";
    document.querySelector("#create-user-update").style.display = "block";
  }

  hiddenFormUpdate() {
    document.querySelector("#create-user").style.display = "block";
    document.querySelector("#create-user-update").style.display = "none";
  }

  atualizarEstatistica() {
    this.countUser = 0;
    this.countAdmin = 0;
    this.countAtivo = 0;
    this.countInativo = 0;

    [...this.alvo.children].forEach((item) => {
      this.countUser++;

      let json = JSON.parse(item.dataset.user);

      if (json._admin) this.countAdmin++;

      if (json._status) {
        this.countAtivo++;
      } else {
        this.countInativo++;
      }
    });
    document.querySelector("#estatisca-user").innerHTML = Utils.padStartNumber(
      this.countUser
    );
    document.querySelector("#estatisca-admin").innerHTML = Utils.padStartNumber(
      this.countAdmin
    );
    document.querySelector("#estatisca-ativo").innerHTML = Utils.padStartNumber(
      this.countAtivo
    );
    document.querySelector("#estatisca-inativo").innerHTML =
      Utils.padStartNumber(this.countInativo);

    this.graficoOnes.destroy();
    this.graficoTwos.destroy();
    this.graficoTwon();
    this.graficoOne();
  }
  graficoOne() {
    const ctx2 = document.getElementById("myChart2");
    this.graficoOnes = new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: ["Usuários", "Ativos", "Administradores", "Inativos"],
        datasets: [
          {
            label: "Quantidade",
            data: [
              this.countUser,
              this.countAtivo,
              this.countAdmin,
              this.countInativo,
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  graficoTwon() {
    const ctx = document.getElementById("myChart1");

    this.graficoTwos = new Chart(ctx, {
      type: "polarArea",
      data: {
        labels: ["Usuários", "Ativos", "Administradores", "Inativos"],
        datasets: [
          {
            label: "Quantidade",
            data: [
              this.countUser,
              this.countAtivo,
              this.countAdmin,
              this.countInativo,
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
