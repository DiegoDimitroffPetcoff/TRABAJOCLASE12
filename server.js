
const { Server: HttpServer} = require('http');
const { Server: IOServer } = require('socket.io');
const fs = require("fs");
const express = require("express");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


const multer = require("multer");
const handlebars = require("express-handlebars");
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials/",
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("public"));

let storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

// _________________________________________________________________________
class Contenedor {
  constructor() {
    this.route = "./productos.txt";
    this.id = 1;
  }
  save(x) {
    let array = [];
    let object = x;

    try {
      let data = fs.readFileSync(this.route, "utf-8");
      array = JSON.parse(data);
      console.log("Ingreso por TRY");

      // aca el array deberia estar completo
      // con los objetos parseados del archivo
    } catch {
      console.log("catch error");
    }

    console.log(array);
    object.id = array.length + 1;
    array.push(object);

    let lastId = array.length + 1;
    fs.writeFileSync(this.route, JSON.stringify(array));

    this.id = lastId++;
  }

  // -----------------------------------------------------------------------------

  getById(x) {
    let array = [];
    let y = x;
    try {
      let data = fs.readFileSync(this.route, "utf-8");
      array = JSON.parse(data);
    } catch {
      console.log("catch error");
    }
    let object = null;

    array.forEach((element) => {
      if (element.id == y) {
        object = element;
      }
    });

    if (object == null || object == undefined || object == false) {
      object = "Error, producto no encontrado";
    }
    return object;
  }

  deleteById(x) {
    let array = [];
    let y = x;
    try {
      let data = fs.readFileSync(this.route, "utf-8");
      array = JSON.parse(data);
      console.log("Ingreso por TRY");
    } catch {
      console.log("catch error");
    }

    array.forEach((element) => {
      if (element.id == y) {
        let id = element.id - 1;
        let removed = array.splice(id, 1);
        console.log("ELEMENTO ELIMINADO: " + JSON.stringify(removed));
        fs.writeFileSync(this.route, JSON.stringify(array));
        console.log(array);
      }
    });
  }

  edit(id, nombre, price) {
    let y = id;
    let readFinal = fs.readFileSync(this.route, "utf-8");
    let allProducts = JSON.parse(readFinal);

    console.log(allProducts);

    allProducts.forEach((element) => {
      if (element.id == y) {
        element.title = nombre;
        element.price = price;
      }
    });
    console.log(allProducts);
    fs.writeFileSync(this.route, JSON.stringify(allProducts));
    return allProducts;
  }

  read() {
    let readFinal = fs.readFileSync(this.route, "utf-8");

    let allProducts = JSON.parse(readFinal);

    return allProducts;
  }
}

const contenedor = new Contenedor();

class NuevoObjeto {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }
}

// __________________________________________________________________________
io.on('connection', (socket)=>{
  console.log("mensaje desde el servidor");
  socket.emit('myMessage','Usuario conectado')
});
app.get("/", function (req, res) {
  res.sendFile("main.hbs", { root:__dirname});
});

// app.get("/", function (req, res) {
//   res.render("main", { Mascotas: contenedor.read()});
// });
// app.post("/", function (req, res) {
//   res.render("main", {
//     todo: contenedor.save(req.body),
//     Mascotas: contenedor.read()
//   });
// });


const server = httpServer.listen(8080, () => {
  console.log("Server " + PORT + " is reading rigth now");
});
