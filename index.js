 const express = require("express");
const Users = require("./db/User");
const Products = require("./db/Product");
const cors = require("cors");
const e = require("express");
require("./db/config");
const app = express();

app.use(express.json());
app.use(cors());



app.post('/', (req, resp) => {

    resp.send("hello world");

});


app.post('/ragister', async (req, resp) => {

    const userdata = new Users(req.body);
    const result = await userdata.save();
    //result=result.toObject();
    //delete result.password;
    resp.send(result);
    console.log(result);

})


app.post('/login', async (req, resp) => {

    if (req.body.password && req.body.email) {

        let user = await Users.findOne(req.body);//;.select("-password");
        console.log(user);

        if (user) {
            resp.send(user);
        }
        else {
            resp.send({ result: "No User found" })
        }
    }
});


app.post('/addproduct', async (req, resp) => {

    const adddata = await new Products(req.body);

    const result = await adddata.save();

    resp.send(result);

    console.log(result);

})





app.get('/products', async (req, resp) => {
    let products = await Products.find();
    if (products.length > 0) {
        resp.send(products);
    }
    else {
        resp({ result: "no data found" });
    }
})



app.delete("/product/:id", async (req, resp) => {

    let result = await Products.deleteOne({ _id: req.params.id });
    resp.send(result)

})



app.get("/product/:id", async (req, resp) => {

    let result = await Products.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result);
    }
    else {
        resp.send({ result: "no result found" });
    }

})


app.put("/product/:id", async (req, resp) => {

    let result = await Products.updateOne({ _id: req.params.id }, { $set: req.body });
    resp.send(result)

})


app.get("/search/:key", async (req, resp) => {

    const result = await Products.find({

        "$or": [
               { name: { $regex: req.params.key } },
               { price: { $regex: req.params.key } },
               { category: { $regex: req.params.key } },
                { category: { $regex: req.params.key } }
              ]

    });

    resp.send(result);
})






app.listen(5000);



