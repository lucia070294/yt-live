export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send('Missing video ID');

  const ytUrl = `https://m3u8.dev{id}.m3u8`;

  try {
    const response = await fetch(ytUrl, {
      method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'manual'
    });

    let realStreamUrl = response.headers.get('location') || ytUrl;
    realStreamUrl = realStreamUrl.replace(/\\/g, '');

    res.redirect(302, realStreamUrl);

  } catch (error) {
    res.status(500).send(`Cloud抓包错误: ${error.message}`);
  }
}
