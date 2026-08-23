import needle from 'needle';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send('Missing video ID');

  // 改用加号拼接网址，彻底杜绝反引号和美元符号在网页端可能产生的转义错误
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
