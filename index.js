const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 3001;
const learningObjects = require("./learningObjects.js").default;
const allowedFilters = require("./filters.js").default;
const MAX_LEARNING_OBJECTS_PER_PAGE = 2;

app.use(bodyParser.json());
app.use("/storage", express.static("storage"));
app.use("/content", express.static("content"));

// respond with "hello world" when a GET request is made to the homepage
app.post("/login", function (req, res) {
  const body = req.body;
  if (!body.username || !body.password) {
    res.status(400).send({
      message: "Username and password must be included.",
    });
    return;
  }
  // HANDLE USERNAME AND PASSWORD VALIDATION
  res.send({
    accessToken: "e3460519d91b0d7c0320e8ae2a4112ce863e62f6be6d39ff58e2fda19a1995a8"
  });
});

app.all("/learningObjects", function (req, res, next) {
  const accessToken =
    "e3460519d91b0d7c0320e8ae2a4112ce863e62f6be6d39ff58e2fda19a1995a8";
  if (!req.headers.authorization) {
    res.status(400).send({
      message: "Access Token not found.",
    });
  } else if (req.headers.authorization !== accessToken) {
    res.status(401).send({
      message: "Invalid access token.",
    });
  } else {
    next();
  }
});

app.get("/learningObjects", function (req, res) {
  var page = parseInt(req.query.page);
  if (!page) {
    page = 1;
  }
  var filters = req.query;
  if (page) {
    delete filters.page;
  }
  var learningObjectsData = learningObjects;
  if (Object.keys(filters).length > 0) {
    for (const filterName in filters) {
      const filterValue = filters[filterName];
      learningObjectsData = learningObjectsData.filter((learningObject) => {
        return learningObject[filterName] === filterValue;
      });
    }
  }
  res.send({
    data: learningObjectsData.slice(
      page * MAX_LEARNING_OBJECTS_PER_PAGE - MAX_LEARNING_OBJECTS_PER_PAGE,
      page * MAX_LEARNING_OBJECTS_PER_PAGE
    ),
    page: page,
    pages: Math.round(learningObjectsData.length / MAX_LEARNING_OBJECTS_PER_PAGE),
  });
});

app.get("/learningObjects/filters", function (req, res) {
  res.send({
    data: allowedFilters,
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
