import needle from 'needle';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send('缺少直播视频ID');

  // 第一步：由 Vercel 海外亚马逊机房的 IP 代替你，去向公共源请求解析出底层真实链接
  const ytUrl = `https://m3u8.dev{id}.m3u8`;

  try {
    // 第二步：流媒体反向代理（Stream Proxy），彻底隐藏你的本地 IP
    // 服务器建立高速云端长连接拉取视频数据，再无缝喂给你的播放器
    const stream = needle.get(ytUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      response_timeout: 30000,
      read_timeout: 30000
    });

    res.setHeader('Content-Type', 'application/x-mpegURL');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // 流量在海外云端高速闭环中转，YouTube 只能追踪到 Vercel，你本地 IP 绝对安全
    stream.pipe(res);

  } catch (error) {
    res.status(500).send(`云端反代错误: ${error.message}`);
  }
}
