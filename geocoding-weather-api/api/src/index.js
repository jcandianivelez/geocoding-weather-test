import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import util from "util";

const app = express();

dotenv.config();

app.set("port", process.env.PORT || 3001);
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/geocode/benchmarks", async (req, res) => {
  try {
    const payload = {
      benchmarkName: "Public_AR_Current",
      vintage: "Current_Current",
      format: "json",
    };

    const request = await axios.post(process.env.BENCHMARKS_API, payload);

    res.json(request.data);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.get("/geocode/coordinates", async (req, res) => {
  const { address, benchmark: benchmarkId } = req.query;

  try {
    const params = `?address=${address}&benchmark=${benchmarkId}&format=json`;
    const coordinatesUrl = `${process.env.BASE_GEOCODE_API}${params}`;

    const request = await axios.get(coordinatesUrl);

    if (request.data.result.addressMatches.length === 0) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.json(request.data.result.addressMatches[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.get("/weather/forecastWeakly", async (req, res) => {
  const { latitude, longitude } = req.query;

  try {
    const forecastUrl = `https://api.weather.gov/points/${latitude},${longitude}`;

    const request = await axios.get(forecastUrl);

    if (!request.data.properties) {
      return res.status(404).json({
        message: "Forecast not found",
      });
    }

    const { forecast } = request.data.properties;

    const forecastRequest = await axios.get(forecast);

    let periods = [];
    let tempPeriods = [];

    for (
      let i = 0;
      i < forecastRequest.data.properties.periods.length;
      i += 2
    ) {
      periods = [
        ...periods,
        forecastRequest.data.properties.periods.slice(i, i + 2),
      ];
    }

    res.json(periods);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(app.get("port"), () => {
  console.log("App is running in port: ", app.get("port"));
});
