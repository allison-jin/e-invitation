const ApplicationPolicy = require("./application");

module.exports = class ListPolicy extends ApplicationPolicy {

  new() {
    return this._isAdmin() || this._isMember() || this._isPremium() || this._isOwner();
  }

  create() {
    return this.new();
  }

  edit() {
    return this._isAdmin() || this._isOwner();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}