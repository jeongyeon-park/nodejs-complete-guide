const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
//app.set("view engine", "hbs");
//app.set("view engine", "pug");
// 어디에 동적 템플릿이 있는지 알림
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

//request 파싱
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// 사용자를 확보 & 저장하고
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasOne(Cart);
Cart.belongsTo(User);

//through : 연결들의 저장위치 알려줌
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
    //console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Max", email: "test@test.com" });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    // console.log(user);
    user.createCart();
  })
  .then((cart) => app.listen(3000))
  .catch((err) => {
    console.log(err);
  });
