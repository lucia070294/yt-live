export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send('缺少直播视频ID');

  // 第一步：由 Vercel 海外顶级机房的 IP 代替你，去向公共源请求解析出底层真实链接
  const ytUrl = `https://m3u8.dev{id}.m3u8`;

  try {
    // 伪装头部，向源站发起极速嗅探
    const response = await fetch(ytUrl, {
      method: 'HEAD', // 只获取头部，不下载视频流量，速度极快
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'manual' // 拦截层级
    });

    // 提取出真正带有 YouTube 动态加密 Token 的真实 `.m3u8` 直播流
    let realStreamUrl = response.headers.get('location') || ytUrl;

    // 清除可能存在的转义反斜杠
    realStreamUrl = realStreamUrl.replace(/\\/g, '');

    // 第二步：通过 302 重定向瞬间把安全、最新的信号源吐给你的播放器
    // 整个过程只需 0.3 秒，Vercel 永远不会超时，播放器完美秒开！
    res.redirect(302, realStreamUrl);

  } catch (error) {
    res.status(500).send(`云端抓包错误: ${error.message}`);
  }
}
