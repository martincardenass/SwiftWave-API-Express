const Item = require("../models/Item");

//?img upload
const multer = require("multer");
const path = require("path");

//?functions
const getSortQuery = (req) => {
  const sortField = req.query.sortField || "price";
  const sortOrder = req.query.sortOrder || "";
  const sortParameters = {};
  sortParameters[sortField] = sortOrder === "desc" ? -1 : 1;
  return sortParameters;
};

const getPaginationQuery = (req) => {
  const limitSize = req.query.limit || 20; //? max amount of items to paginate
  const pageNumber = req.query.page || 1; //? page number
  const skipValue = (pageNumber - 1) * limitSize;
  return {
    skipValue: skipValue,
    pageNumber: pageNumber,
    limitSize: limitSize,
  };
};

const getPriceQuery = (req, filter) => {
  const minPrice = parseFloat(req.query.minprice);
  const maxPrice = parseFloat(req.query.maxprice);
  if (minPrice) {
    filter.price = { $gte: minPrice };
  }
  if (maxPrice) {
    filter.price = { ...filter.price, $lte: maxPrice };
  }
};

const getCategoryQuery = (req, filter) => {
  const category = req.query.category;
  if (category) {
    filter.category = req.query.category;
  }
};

const getAllItems = async (req, res) => {
  try {
    const sortParameters = getSortQuery(req); //?sorting
    const search = req.query.search || "";

    const items = await Item.find({ title: { $regex: search, $options: "i" } }).sort(sortParameters);
    const total = await Item.countDocuments({
      title: { $regex: search, $options: "i" },
    });

    res.status(200).json({ items, total });
  } catch (error) {
    res.status(500).json({ msg: "Error", error });
  }
};

const getPopularItems = async (req, res) => {
  try {
    const pagination = getPaginationQuery(req); //?pagination
    const sortParameters = getSortQuery(req); //?sorting
    const filter = {
      //? used to store various filtering conditions
      isPopular: true,
    };
    getPriceQuery(req, filter); //?price
    getCategoryQuery(req, filter); //?category

    const items = await Item.find(filter)
      .skip(pagination.skipValue)
      .limit(pagination.limitSize)
      .sort(sortParameters); //? Will only get popular items
    const total = await Item.countDocuments(filter); //? wWill count the number of popular items
    const queryTotalPages = Math.ceil(total / pagination.limitSize);
    res.status(200).json({ items, total, queryTotalPages });
  } catch (error) {
    res.status(500).json({ msg: "Error", error });
  }
};

const getItemsByPage = async (req, res) => {
  try {
    const sortParameters = getSortQuery(req); //?sorting
    const pagination = getPaginationQuery(req); //?pagination
    const filter = {}; //? used to store various filtering conditions
    getPriceQuery(req, filter); //?price
    getCategoryQuery(req, filter); //?category

    const total = await Item.countDocuments(req.body); //?gets the total of items matching the query
    const queryTotal = await Item.countDocuments(filter); //?gets the total of the items of a certain category
    const queryTotalPages = Math.ceil(queryTotal / pagination.limitSize);
    const totalPages = Math.ceil(queryTotal / pagination.limitSize); //?gets the total of pages
    const currentPage = pagination.pageNumber;
    const hPrice = await Item.find(filter).sort({ price: -1 }).limit(1); //?gets the highest price (the whole item)
    const highestPrice = hPrice.length > 0 ? hPrice[0].price : null; //?gets only the value of the price
    const lPrice = await Item.find(filter).sort({ price: 1 }).limit(1); //? gets the lowest price (the whole item)
    const lowestPrice = lPrice.length > 0 ? lPrice[0].price : null; //?gets only the value of the price

    const items = await Item.find(filter)
      .skip(pagination.skipValue)
      .limit(pagination.limitSize)
      .sort(sortParameters);

    res.status(200).json({
      items,
      total,
      totalPages,
      currentPage,
      queryTotal,
      queryTotalPages,
      highestPrice,
      lowestPrice,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error", error });
  }
};

const createItems = async (req, res) => {
  try {
    const newItem = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      amount: req.body.amount,
      image: req.file.path,
      date: Date.now(),
      category: req.body.category,
      isPopular: req.body.isPopular,
    };
    const item = await Item.create(newItem);
    res.status(201).send(item);
  } catch (error) {
    res.status(500).json({ msg: "Error", error });
  }
};

const getItem = async (req, res) => {
  try {
    const { id: itemID } = req.params;
    const item = await Item.findOne({ _id: itemID });
    if (!item) {
      return res.status(404).json({ msg: `No such item ${itemID}` });
    }
    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ msg: "Error", error });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id: itemID } = req.params;
    const item = await Item.findOneAndDelete({ _id: itemID });
    res.status(200).json({ item, status: `deleting ${itemID} success` });
  } catch (error) {
    res.status(500).json({ msg: "Error", error });
  }
};

const deleteAllItems = async (req, res) => {
  //!
  try {
    await Item.deleteMany();
    res.status(200).json({ msg: "Purged the database success" });
  } catch (error) {
    res.status(500).json({ msg: "Error", error });
  }
};

const updateItem = async (req, res) => {
  try {
    const itemID = req.params.id;
    const update = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      amount: req.body.amount,
      isPopular: req.body.isPopular,
      category: req.body.category,
    };
    req.file ? (update.image = req.file.path) : null;
    const item = await Item.findOneAndUpdate({ _id: itemID }, update, {
      new: true, //runValidators: true
    });

    if (!item) {
      return res.status(404).json({ msg: `No such item with ${itemID}` });
    }
    res.status(201).send(item);
  } catch (error) {
    res.status(500).json({ msg: "Error updating item", error });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("image");

module.exports = {
  // export as an object
  getAllItems,
  getItemsByPage,
  createItems,
  getItem,
  deleteItem,
  updateItem,
  deleteAllItems,
  upload,
  getPopularItems,
};
