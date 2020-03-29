const mongoose = require("mongoose");
let Float = require("mongoose-float").loadType(mongoose, 1);

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  unitPrice: {
    type: Number
  },
  priceOnOrder: {
    type: Number
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories"
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  color: [
    {
      name: {
        type: String
      },
      hex: {
        type: String
      },
      plus: Number
    }
  ],
  rating: {
    type: Float
  },
  hisprice: {
    type: Number
  },
  bonus: {
    type: {
      info: {
        type: String
      },
      append: {
        type: Number,
        default: -1
      }
    }
  },
  protype: {
    type: Number
  },
  techData: {
    manhinh: String,
    hdh: String,
    camt: String,
    cams: String,
    cpu: String,
    ram: String,
    bnt: [
      {
        number: String,
        plus: Number
      }
    ],
    sim: String,
    pin: String
  }
});

module.exports = Product = mongoose.model("Product", ProductSchema);
