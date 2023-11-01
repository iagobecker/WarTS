import express from "express";
import http from "http";
import socketIO from "socket.io";
import venom from "venom-bot";

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

app.set("view engine", "ejs");
app.get("/indications", (req, res) => {
  res.render("indications");
});
app.use(express.static("/images"));

io.on("connection", (socket) => {
  console.log("User connected:" + socket.id);

  socket.on("message", () => {
    venom
      .create({
        session: "sessionName",
        catchQR: (base64Qr, asciiQR) => {
          console.log(asciiQR);
          const matches = base64Qr.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
          const response = {};

          if (matches.length !== 3) {
            throw new Error("Invalid input string");
          }
          response.type = matches[1];
          response.data = Uint8Array.from(atob(matches[2]), (c) =>
            c.charCodeAt(0)
          );

          socket.emit("image", btoa(String.fromCharCode(...response.data)));

          fetch("./images/out.png", {
            method: "POST",
            body: new Blob([response.data], { type: response.type }),
          })
            .then((res) => res.blob())
            .then((blob) => {
              const url = URL.createObjectURL(blob);
              socket.emit("image", url);
            })
            .catch((err) => console.error(err));
        },
        logQR: false,
      })
      .then((client) => {
        start(client);
      })
      .catch((error) => console.log(error));

    function start(client) {
      client.onStateChange((state) => {
        socket.emit("message", "Status: " + state);
        console.log("state change: ", state);
      });
    }
  });

  socket.on("ready", () => {
    setTimeout(function () {
      socket.emit("ready", "./out.png");
    }, 8000);
  });
});

server.listen(8000, () => {
  console.log("Server is running on port 3000");
});
