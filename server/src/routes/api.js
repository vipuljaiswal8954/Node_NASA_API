const express = require("express");

const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const app = express();

const api = express.Router();

api.use("/planets", planetsRouter);
api.use("/launches", launchesRouter);

module.exports = api;
