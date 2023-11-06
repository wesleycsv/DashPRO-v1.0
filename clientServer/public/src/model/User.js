class User {
  constructor(
    name,
    email,
    genero,
    nascimento,
    pais,
    senha,
    foto,
    admin,
    status
  ) {
    this._id;
    this._name = name;
    this._email = email;
    this._genero = genero;
    this._nascimento = nascimento;
    this._pais = pais;
    this._senha = senha;
    this._foto = foto;
    this._admin = admin;
    this._status = status;
    this._register = new Date();
  }
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get email() {
    return this._email;
  }
  get genero() {
    return this._genero;
  }
  get nascimento() {
    return this._nascimento;
  }
  get pais() {
    return this._pais;
  }
  get senha() {
    return this._senha;
  }
  get admin() {
    return this._admin;
  }
  get status() {
    return this._status;
  }
  get foto() {
    return this._foto;
  }
  set foto(value) {
    this._foto = value;
  }
  get register() {
    return this._register;
  }
  loadFromJson(json) {
    for (let name in json) {
      if (name.substring(0, 1) === "_") this[name] = json[name];
    }
  }
  static getSessionStore() {
    let users = [];
    if (localStorage.getItem("users")) {
      users = JSON.parse(localStorage.getItem("users"));
    }
    return users;
  }
  newId() {
    let userId = JSON.parse(localStorage.getItem("userId"));

    if (!userId) userId = 0;
    userId++;

    localStorage.setItem("userId", userId);
    return userId;
  }
  loadJson() {
    let json = {};
    Object.keys(this).forEach((key) => {
      if (this[key] !== undefined) json[key] = this[key];
    });
    return json;
  }
  save() {
    return new Promise((resolve, reject) => {
      let promise;
      if (this.id) {
        promise = HttpRequest.put(`/users/${this.id}`, this.loadJson());
      } else {
        promise = HttpRequest.post(`/users`, this.loadJson());
      }

      promise
        .then((data) => {
          this.loadFromJson(data);
          resolve(this);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  remove() {
    return HttpRequest.delete(`/users/${this.id}`);
  }
}
