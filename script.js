const express = require('express')
const app = express()
app.set('view engine', "hbs")

var path = require('path')
const { log } = require('console')
app.use(express.static(path.join(__dirname, 'public')))

const BodyParser = require("body-parser")
const urlencoder = BodyParser.urlencoded({extended: false})

const Sequelize = require("sequelize")
const sequelize = new Sequelize ("john", "root", "", {
    dialect: "mysql",
    host: "localhost",
})

const Work = sequelize.define("work", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    header: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tag: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

const Posts = sequelize.define("post", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    header: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tag: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: false
    },
})

app.get("/", function(req, res) {
    Work.findAll({raw: true, limit: 3}).then(works=>{
        Posts.findAll({raw: true, limit: 2}).then(posts=>{
            res.render("index.hbs", {works: works, posts: posts})
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
})

app.get("/blogs", function(req, res) {
    Posts.findAll({raw: true}).then(data=>{
        res.render("blogs.hbs", {posts: data})
    }).catch(err=>console.log(err))
})

app.get("/works", function(req, res) {
    Work.findAll({raw: true}).then(data=>{
        res.render("works.hbs", {works: data})
    }).catch(err=>console.log(err))
})

app.get("/blogs-create", function(req, res) {
    res.render("blogs-create.hbs")
})

app.post("/blogs-create", urlencoder, function(req, res) {
    let header = req.body.header
    let tag = req.body.tag
    let text = req.body.text
    let createdAt = new Date()
    let updatedAt = createdAt

    Posts.create({header:header, tag:tag, text:text, createdAt:createdAt, updatedAt:updatedAt}).then(() => {
        res.redirect("/blogs")
    })
})

app.get("/blogs-update/:id", function(req, res) {
    const postId = req.params.id
    Posts.findOne({where: {id: postId}}).then((data) => {
        res.render("blogs-update.hbs", {post: data})
    })
})

app.post("/blogs-update/:id", urlencoder, function(req, res) {
    let id = req.params.id
    let header = req.body.header
    let tag = req.body.tag
    let text = req.body.text
    let updatedAt = new Date()

    Posts.update({header:header, tag:tag, text:text, updatedAt:updatedAt}, {where: {id:id}}).then(() => {
        res.redirect("/blogs")
    })
})

app.get("/blogs-delete/:id", function(req, res) {
    const postId = req.params.id
    Posts.destroy({where: {id: postId}}).then(() => {
        res.redirect("/blogs")
    })
})

// app.get("/work-detailed", function(req, res) {
//     res.render("work-detailed.hbs", {works: data})
// })

// app.get("/product/:id", function(req, res) {
//     const productId = req.params.id
//     res.render("product.hbs", {product: products[productId-1]})
// })

sequelize.sync().then(()=>{
    app.listen(3007, function() {
        console.log("Сервер запущен")
    })
}).catch(err=>console.log(err))