const Order = require("../models/Order");
const User = require("../models/User");
const OrderDetail = require("../models/OrderDetail");
const Product = require("../models/Product");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const AddOrder = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    if (
      foundUser.address == "" ||
      foundUser.phone == "" ||
      foundUser.email == ""
    )
      return res.status(403).json({
        error: { message: "Người dùng chưa cập nhật đầy đủ thông tin!!!" },
      });
    const newOrder = new Order({
      userName: foundUser.userName,
      userPhone: foundUser.phone,
      userAddress: foundUser.address,
      userID: foundUser._id,
    });
    const result = await newOrder.save();
    return res.json({
      success: true,
      message: "Add New Order Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const UpdateOrderShipDate = async (req, res, next) => {
  try {
    const orderID = req.params.orderID;
    const { dateShipped } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    await Order.findByIdAndUpdate(orderID, { dateShipped: dateShipped });
    return res.json({
      success: true,
      message: "Update Order Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const UpdateOrderTotalMoney = async (req, res, next) => {
  try {
    const orderID = req.params.orderID;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await OrderDetail.find({ orderID: orderID });
    let totalmn = 0;
    for (let i = 0; i < result.length; i++) {
      totalmn = totalmn + result[i].totalMoney;
    }

    await Order.findByIdAndUpdate(orderID, { totalMoney: totalmn });
    return res.json({
      success: true,
      message: "Update Order Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const UpdateOrderStatus = async (req, res, next) => {
  try {
    const orderID = req.params.orderID;
    const { orderStatus } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    await Order.findByIdAndUpdate(orderID, { orderStatus: orderStatus });
    if (orderStatus === "refund") {
      const findOrderDetail = await OrderDetail.find({ orderID: orderID });
      for (let index = 0; index < findOrderDetail.length; index++) {
        const findProduct = await Product.findOne({
          _id: findOrderDetail[index].productID,
        });
        await Product.findByIdAndUpdate(findProduct._id, {
          quantity: findProduct.quantity + findOrderDetail[index].quantity,
        });
      }
      await OrderDetail.deleteMany({ orderID: orderID });
    }
    return res.json({
      success: true,
      message: "Update Order Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const DeleteOrder = async (req, res, next) => {
  try {
    const orderID = req.params.orderID;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    await Order.deleteOne({ _id: orderID });
    await OrderDetail.deleteMany({ orderID: orderID });
    return res.json({
      success: true,
      message: "Delete Order Success!!!",
    });
  } catch (error) {
    next(error);
  }
};
const GetAllOrderByUserID = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await Order.find({ userID: req.userID });
    if (result) {
      return res.json({
        status: 200,
        message: "Get All Order Success!!!",
        result: result.sort(function (a, b) {
          return b.dateCreated - a.dateCreated;
        }),
      });
    }
    if (!result) {
      return res.json({
        status: 400,
        message: "Get All Order Success!!!",
        result: [],
      });
    }
  } catch (error) {
    next(error);
  }
};

const GetAllOrderByStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await Order.find({
      userID: req.userID,
      orderStatus: orderStatus,
    });
    if (result) {
      return res.json({
        status: 200,
        message: "Get All Order Success!!!",
        result: result.sort(function (a, b) {
          return b.dateCreated - a.dateCreated;
        }),
      });
    }
    if (!result) {
      return res.json({
        status: 400,
        message: "Get All Order Success!!!",
        result: [],
      });
    }
  } catch (error) {
    next(error);
  }
};

const GetAllOrder = async (req, res, next) => {
  try {
    const result = await Order.find({});

    return res.json({
      success: true,
      message: "Get All Order Success!!!",
      result: result.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      }),
    });
  } catch (error) {
    next(error);
  }
};

const SendOrderEmail = async (req, res, next) => {
  try {
    const { orderID, pay } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const findOrder = await Order.findOne({ _id: orderID });
    const findOrderDetail = await OrderDetail.find({ orderID: orderID });
    const ar = [];
    for (let index = 0; index < findOrderDetail.length; index++) {
      const findProduct = await Product.findOne({
        _id: findOrderDetail[index].productID,
      });
      ar.push({
        _id: findProduct._id,
        productName: findProduct.productName,
        uniCost: findOrderDetail[index].uniCost,
        quantity: findOrderDetail[index].quantity,
        totalMoney: findOrderDetail[index].totalMoney,
      });
    }
    const foundUserReceived = await User.findOne({ _id: findOrder.userID });
    await sgMail.send({
      to: `${foundUserReceived.email}`,
      from: process.env.NODEMAILER_EMAIL,
      subject: "Hóa đơn mua hàng từ Toyskid",
      html: `<!DOCTYPE html>
      <html>
      <head>
      <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }
      
      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      
      tr:nth-child(even) {
        background-color: #dddddd;
      }
      </style>
      </head>
      <body>
      <div>
     <strong> Mã hóa đơn: ${orderID}</strong>
  <br><strong> Tên người mua: ${foundUserReceived.userName}</strong>
  <br><strong> Số điện thoại: ${foundUserReceived.phone}</strong>
  <br><strong> Địa chỉ: ${foundUserReceived.address}</strong>
  <br><strong> Ngày gửi: ${findOrder.dateCreated}</strong>
  <br><strong> Tổng tiền: ${findOrder.totalMoney}₫</strong>
  <br><strong> Chi tiết hóa đơn: 
  <br>
  <table>
       <tr>
          <th>Mã sản phẩm</th>
          <th>Tên sản phẩm</th>
          <th>giá gốc</th>
          <th>Số lượng</th>
          <th>Tổng tiền</th>
       </tr>
     ${ar.map(
       (data) =>
         `<tr>
          <td>${data._id}</td>
          <td>${data.productName}</td>
          <td>${data.uniCost}</td>
          <td>${data.quantity}</td>
          <td>${data.totalMoney}</td>
        </tr>`
     )}
  </table >
  <br>
  Hình thức thanh toán: ${pay}
      </div>
      </body>
</html>`,
    });

    return res.json({
      status: 200,
      message: "Gửi hóa đơn thành công!!!",
      re: foundUser.email,
    });
  } catch (error) {
    next(error);
  }
};

const GetCostEachUser = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    let arr = [];
    const getAllUser = await User.find({ role: 2 || 3 });
    for (let index = 0; index < getAllUser.length; index++) {
      const findOrder = await Order.find({
        userID: getAllUser[index]._id,
        orderStatus: "received",
      });

      if (!findOrder) {
        arr.push({ name: getAllUser[index].userName, cost: 0 });
      }
      if (findOrder) {
        let cos = 0;
        for (let i = 0; i < findOrder.length; i++) {
          cos += findOrder[i].totalMoney;
        }
        arr.push({ name: getAllUser[index].userName, cost: cos });
      }
    }
    arr.sort(function (a, b) {
      return b.cost - a.cost;
    });

    return res.json({
      status: 200,
      message: "Get All Order Success!!!",
      result: arr.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
};

const GetOrderByStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const result = await Order.find({
      orderStatus: orderStatus,
    });
    if (result) {
      return res.json({
        status: 200,
        message: "Get All Order Success!!!",
        result: result.sort(function (a, b) {
          return b.dateCreated - a.dateCreated;
        }),
      });
    }
    if (!result) {
      return res.json({
        status: 400,
        message: "Get All Order Success!!!",
        result: [],
      });
    }
  } catch (error) {
    next(error);
  }
};

const GetChart = async (req, res, next) => {
  try {
    const { month, year } = req.body;
    const findOrder = await Order.find({
      orderStatus: "received",
    });

    if (!month && !year) {
      const now = new Date();
      const nowmonth = now.getMonth();
      const noyear = now.getFullYear();
      const result = findOrder.filter((p) => {
        return (
          new Date(p.dateCreated).getMonth() === nowmonth &&
          new Date(p.dateCreated).getFullYear() === noyear
        );
      });
      let arr = [];
      for (let index = 0; index < result.length; index++) {
        arr.push({
          time: new Date(result[index].dateCreated).getDate(),
          value: result[index].totalMoney,
        });
      }
      // let arrr = [];
      // for (let index = 1; index < arr.length; index++) {
      //   if (arr[index].time === arr[index - 1].time) {
      //     arrr.push({
      //       time: arr[index].time,
      //       value: arr[index].value + arr[index - 1].value,
      //     });
      //   }
      //   if (arr[index].time !== arr[index - 1].time) {
      //     arrr.push({
      //       time: arr[index].time,
      //       value: arr[index].value,
      //     });
      //   }
      // }

      return res.json({
        status: 200,
        message: "Get All Order Success!!!",
        result: arr.sort(function (a, b) {
          return a.time - b.time;
        }),
      });
    }
    if (month && year) {
      const result = findOrder.filter((p) => {
        return (
          new Date(p.dateCreated).getMonth() === month - 1 &&
          new Date(p.dateCreated).getFullYear() === year
        );
      });
      let arr = [];
      for (let index = 0; index < result.length; index++) {
        arr.push({
          time: new Date(result[index].dateCreated).getDate(),
          value: result[index].totalMoney,
        });
      }
      // let arrr = [];
      // for (let index = 1; index < arr.length; index++) {
      //   if (arr[index].time === arr[index - 1].time) {
      //     arrr.push({
      //       time: arr[index].time,
      //       value: arr[index].value + arr[index - 1].value,
      //     });
      //   }
      //   if (arr[index].time !== arr[index - 1].time) {
      //     arrr.push({
      //       time: arr[index].time,
      //       value: arr[index].value,
      //     });
      //   }
      // }

      return res.json({
        status: 200,
        message: "Get All Order Success!!!",
        result: arr.sort(function (a, b) {
          return a.time - b.time;
        }),
      });
    }
    if (!month && year) {
      const result = findOrder.filter((p) => {
        return new Date(p.dateCreated).getFullYear() === year;
      });
      let arr = [];
      for (let index = 0; index < result.length; index++) {
        arr.push({
          time: new Date(result[index].dateCreated).getMonth() + 1,
          value: result[index].totalMoney,
        });
      }
      // let arrr = [];
      // for (let index = 1; index < arr.length; index++) {
      //   if (arr[index].time === arr[index - 1].time) {
      //     arrr.push({
      //       time: arr[index].time,
      //       value: arr[index].value + arr[index - 1].value,
      //     });
      //   }
      //   if (arr[index].time !== arr[index - 1].time) {
      //     arrr.push({
      //       time: arr[index].time + 1,
      //       value: arr[index].value,
      //     });
      //   }
      // }

      return res.json({
        status: 200,
        message: "Get All Order Success!!!",
        result: arr.sort(function (a, b) {
          return a.time - b.time;
        }),
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AddOrder,
  UpdateOrderShipDate,
  UpdateOrderTotalMoney,
  UpdateOrderStatus,
  DeleteOrder,
  GetAllOrder,
  SendOrderEmail,
  GetAllOrderByUserID,
  GetAllOrderByStatus,
  GetCostEachUser,
  GetOrderByStatus,
  GetChart,
};
