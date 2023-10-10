class Annonce {
  constructor(id, titre, description, price, condition, location, seller) {
    this.id = id; // Id unique
    this.titre = titre;
    this.description = description;
    this.price = price;
    this.condition = condition;
    this.location = location;
    this.seller = seller;
  }
}

module.exports = Annonce;
