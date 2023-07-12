const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  try {
    const launch = req.body;

    if (
      !launch.mission ||
      !launch.rocket ||
      !launch.target ||
      !launch.launchDate
    ) {
      return res.status(400).json({
        err: "Some Fields are missing",
      });
    }

    if (isNaN(new Date(launch.launchDate))) {
      return res.status(400).json({
        err: "Invalid Date",
      });
    }
    launch.launchDate = new Date(launch.launchDate);

    await addNewLaunch(launch);

    return res.status(201).json(launch);
  } catch (err) {
    return res.status(400).json({ error: `${err}` });
  }
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const existsLaunch = await existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: "Launch Not found",
    });
  }
  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
