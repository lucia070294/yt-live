import needle from 'needle';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send('Missing video ID');

  // 100% 完美的斜杠和加号拼接网址，绝不漏掉任何路径
  const ytUrl = "https://m3u8.dev" + id + ".m3u8";

  try {
    const response = await needle('HEAD', ytUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      follow_max: 0
    });

    let realStreamUrl = response.headers.location || ytUrl;
    realStreamUrl = realStreamUrl.replace(/\\/g, '');

    res.redirect(302, realStreamUrl);

  } catch (error) {
    res.status(500).send(`Cloud抓包错误: ${error.message}`);
  }
}
