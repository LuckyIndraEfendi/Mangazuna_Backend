import { gotScraping } from "got-scraping";
import cheerio from "cheerio";
import userAgent from "../helpers/userAgent.js";
import { baseURL } from "../helpers/apiKey.js";
export const searchAll = async (req, res) => {
  try {
    const response = await gotScraping.get(`${baseURL}/?s=${req.query.q}`, {
      headers: userAgent,
    });

    const html = response.body;

    const $ = cheerio.load(html);
    const search = [];
    $("#content > div.postbody > section > div.film-list > div").each(
      (i, el) => {
        search.push({
          title: $(el).find("div > div > a > div > h4").text(),
          image: $(el)
            .find("div > a > div > img")
            .attr("src")
            .replace("?resize=146,208", " "),
          rating: $(el).find("div > div > div > div > i").text(),
          komik_id: `/details/${$(el)
            .find("div > a")
            .attr("href")
            .replace(`${baseURL}/komik/`, "")
            .replace("/", "")}`,
        });
      }
    );

    res.json({
      statusCode: 200,
      message: "Success",
      data: search,
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export const getSearchKomikDetail = async (req, res) => {
  try {
    const response = await gotScraping.get(
      `${baseURL}/komik/${req.params.details_id}/`,
      { headers: userAgent }
    );

    const html = response.body;

    const $ = cheerio.load(html);

    const images = $("section:nth-child(1) > div > div.thumb > img").attr(
      "data-lazy-src"
    );
    const status = $(
      "section:nth-child(1) > div > div.infox > div.spe > span:nth-child(2)"
    )
      .text()
      .replace("Status:", "")
      .replace(/\s+/g, " ");
    const type = $(
      "section:nth-child(1) > div > div.infox > div.spe > span:nth-child(3) > a"
    )
      .text()
      .replace(/\s+/g, " ");
    const rilis = $(
      "section:nth-child(1) > div > div.infox > div.spe > span:nth-child(6) > a"
    ).text();
    const pengarang = $(
      "section:nth-child(1) > div > div.infox > div.spe > span:nth-child(4) > a"
    ).text();
    const jenis_komik = $(
      "section:nth-child(1) > div > div.infox > div.spe > span:nth-child(3) > a"
    )
      .text()
      .replace(/\s+/g, " ");
    const dilihat = $(
      "section:nth-child(1) > div > div.infox > div.spe > span:nth-child(8)"
    )
      .text()
      .replace("Jumlah Pembaca:", "")
      .replace(/\s+/g, " ");
    let genres = [];
    $("section:nth-child(1) > div > div.infox > div.genre-info > a").each(
      function (i, el) {
        genres.push($(el).text());
      }
    );
    const synopsis = $(
      "#sinopsis > section > div > div.entry-content.entry-content-single > p"
    )
      .text()
      .replace(/\s+/g, " ");
    const rating = $(
      "section:nth-child(1) > div > div.thumb > div > div > div > div > i"
    )
      .text()
      .replace(/\s+/g, " ");

    let chapter_list = [];

    $("#chapter_list > ul > li").each((i, el) => {
      chapter_list.push({
        chapter_title: $(el)
          .find("span.lchx > a > chapter")
          .text()
          .replace(/\s+/g, " "),
        chapter_link: `/chapter/${$(el)
          .find("span.lchx > a")
          .attr("href")
          .replace(`${baseURL}/`, "")}`,
        chapter_update: $(el).find("span.dt > a").text(),
      });
    });

    let komikLainnya = [];
    $("#mirip > div > div > ul > li").each((i, el) => {
      komikLainnya.push({
        title: $(el).find("div.leftseries > h4 > a").text(),
        images: $(el).find(" div.imgseries > a > img").attr("data-lazy-src"),
        details_id: `/details/${$(el)
          .find("div.imgseries > a")
          .attr("href")
          .replace(`${baseURL}/komik`, "")
          .replace("/", "")
          .replace("/", "")}`,
      });
    });

    res.send({
      statusCode: 200,
      data: {
        status,
        images,
        type,
        synopsis,
        rilis,
        pengarang,
        jenis_komik,
        dilihat,
        rating,
        genres,
        chapter_list: {
          chapter_list,
          total_items: chapter_list.length,
        },
        komik_lainnya: {
          komikLainnya,
          total_items: komikLainnya.length,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    });
  }
};
