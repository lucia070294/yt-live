import needle from 'needle';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send('Missing video ID');

  const ytUrl = `https://m3u8.dev{id}.m3u8`;

  try {
    // 使用大厂标配的 needle 库发起极速嗅探，100% 解决 fetch failed 报错
    const response = await needle('HEAD', ytUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      follow_max: 0 // 拦截层级，获取最底层的动态 Token
    });

    let realStreamUrl = response.headers.location || ytUrl;
    realStreamUrl = realStreamUrl.replace(/\\/g, '');

    // 瞬间通过 302 重定向把安全、带最新 Token 的信号源吐给你的播放器
    res.redirect(302, realStreamUrl);

  } catch (error) {
    res.status(500).send(`Cloud抓包错误: ${error.message}`);
  }
}
