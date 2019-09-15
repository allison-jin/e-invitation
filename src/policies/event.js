const ApplicationPolicy = require("./application");

module.exports = class EventPolicy extends ApplicationPolicy {

  show() {
    if (this._isAdmin() || this._isPremium() || this._isMember())
      return true;
  
  }

  new() {
    return this._isAdmin() || this._isPremium() || this._isMember() || this._isOwner();
  }

  create() {
    return this.new();
  }

  edit() {
    return this._isAdmin() || this._isOwner() || this._isPremium() ;
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}