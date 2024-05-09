import { gotScraping } from "got-scraping";
import cheerio from "cheerio";
import userAgent from "../helpers/userAgent.js";
import { baseURL } from "../helpers/apiKey.js";

export const getPopularManga = async (req, res) => {
  try {
    const response = await gotScraping.get(`${baseURL}/komik-terbaru`, {
      headers: userAgent,
    });
    const html = response.body;

    const $ = cheerio.load(html);

    let popularManga = [];
    $("#sidebar > div > aside:nth-child(1) > div > div > div > ul > li").each(
      (i, el) => {
        popularManga.push({
          id: $(el).find("div.leftseries > div").text().replace(/\s+/g, " "),
          title: $(el).find("div.leftseries > h4 > a").text(),
          image: $(el)
            .find("div.imgseries > a > img")
            .attr("data-lazy-src")
            .replace(/\?width=\d+&height=\d+/g, ""),
          rating: $(el).find("div.leftseries > span.loveviews").text(),
          details_id: `/details/${$(el)
            .find("div.imgseries > a")
            .attr("href")
            .replace(`${baseURL}/komik`, "")
            .replace("/", "")
            .replace("/", "")}`,
        });
      }
    );

    res.json({
      statusCode: 200,
      message: "success",
      data: popularManga,
      total_items: popularManga.length,
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export const getAllManga = async (req, res) => {
  try {
    const response = await gotScraping.get(
      `${baseURL}/baca-manga/page/${req.query.page || 1}`,
      {
        headers: userAgent,
      }
    );
    const html = response.body;

    const $ = cheerio.load(html);
    const manga = [];
    let hasPrev = true;
    let hasNext = true;
    const prev = $(
      "#content > div.postbody > section.whites > div.widget-body > div > div > div.pagination > a.prev.page-numbers"
    )
      .text()
      .replace("«", "");
    const next = $(
      "#content > div.postbody > section.whites > div.widget-body > div > div > div.pagination > a.next.page-numbers"
    )
      .text()
      .replace("Berikutnya ", "");
    $(
      "#content > div.postbody > section.whites > div.widget-body > div > div > div.listupd > div"
    ).each((i, el) => {
      manga.push({
        title: $(el).find("div > div > a > div > h4").text(),
        image: $(el).find("div > a > div > img").attr("data-lazy-src"),
        details_id: `/details/${$(el)
          .find(" div > div > a")
          .attr("href")
          .replace(`${baseURL}/komik`, "")
          .replace("/", "")
          .replace("/", "")}`,
        rating: $(el).find("div:nth-child(1) > div > div > div > i").text(),
      });
    });
    if (manga.length === 0) {
      hasNext = false;
      return res.json({
        statusCode: 404,
        message: "Not Found",
      });
    } else if (prev === "") {
      hasPrev = false;
    }
    if (next === "»") {
      hasNext = true;
    } else {
      hasNext = false;
    }

    res.json({
      statusCode: 200,
      message: "Get All Manga",
      data: manga,
      total_items: manga.length,
      has_next: hasNext,
      has_prev: hasPrev,
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};
export const getMangaDetails = async (req, res) => {
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
    const genre = $(
      "section:nth-child(1) > div > div.infox > div.genre-info > a"
    ).each(function (i, el) {
      genres.push($(el).text());
    });
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

export const getMangaChapter = async (req, res) => {
  try {
    const response = await gotScraping.get(
      `${baseURL}/${req.params.chapter_id}`,
      { headers: userAgent }
    );

    const html = response.body;

    const $ = cheerio.load(html);

    let chapter = [];
    $("#anjay_ini_id_kh > img").each((i, el) => {
      chapter.push({
        chapter_image: $(el).attr("data-lazy-src"),
        chaper_imagetitle: $(el).attr("alt"),
      });
    });

    let has_prev = false;
    let has_next = false;
    const has_prev_chapter = $(
      "article > div > div > div:nth-child(3) > div > a:first-child"
    ).attr("rel");
    const has_next_chapter = $(
      "article > div > div > div:nth-child(3) > div > a:last-child"
    ).attr("rel");
    const has_prev_chapterLink = $(
      "article > div > div > div:nth-child(4) > div > a:first-child"
    ).attr("href");

    const has_next_chapterLink = $(
      "article > div > div > div:nth-child(4) > div > a:last-child"
    ).attr("href");

    if (has_next_chapter == "next") {
      has_next = true;
    }
    if (has_prev_chapter == "prev") {
      has_prev = true;
    }

    res.send({
      statusCode: 200,
      data: {
        chapter: {
          chapter: chapter,
          total_items: chapter.length,
        },
      },
      has_prev,
      has_next,
      has_next_chapterLink: has_next_chapterLink,
      has_prev_chapterLink: has_prev_chapterLink,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    });
  }
};
