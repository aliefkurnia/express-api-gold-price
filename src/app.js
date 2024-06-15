<<<<<<< HEAD
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
=======
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { parseHTML } = require("linkedom");
require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

app.use(morgan("dev"));
>>>>>>> master
app.use(helmet());
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);
=======
app.get("/", async (req, res) => {
  try {
    const URL_SOURCE =
      "https://harga-emas.org/widget/widget.php?v_widget_type=current_gold_price";
    const html = await fetch(URL_SOURCE).then((r) => r.text());

    const { document } = parseHTML(html);

    const result = {
      usd: {},
      kurs_bi: {},
      idr: {},
      update_gold_price: "",
      update_kurs_bi: "",
      source: "https://harga-emas.org",
    };

    const table = document.querySelector("table");
    const rows = Array.from(table.querySelectorAll("tr"));

    const satuan = rows.slice(2, 5).map((row) => {
      const cols = Array.from(row.querySelectorAll("td")).map((col) =>
        col.textContent.trim()
      );
      return {
        satuan: cols[0],
        usd: cols[1],
        kurs_bi: cols[2],
        idr: cols[3],
      };
    });

    result.usd.oz = satuan[0].usd;
    result.usd.gr = satuan[1].usd;
    result.usd.kg = satuan[2].usd;

    result.kurs_bi.oz = satuan[0].kurs_bi;
    result.kurs_bi.gr = satuan[1].kurs_bi;
    result.kurs_bi.kg = satuan[2].kurs_bi;

    result.idr.oz = satuan[0].idr;
    result.idr.gr = satuan[1].idr;
    result.idr.kg = satuan[2].idr;

    const prices_update = Array.from(
      rows[rows.length - 1].querySelectorAll("strong")
    ).map((n) => n.textContent.trim());

    result.update_gold_price = prices_update[0];
    result.update_kurs_bi = prices_update[1];

    res.setHeader("Content-Type", "application/json");
    return res.send(result);
  } catch (error) {
    console.error("Error fetching gold price:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch gold price", message: error.message });
  }
});

app.use("/api/v1", api);
>>>>>>> master

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
