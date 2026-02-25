import { Card, Typography, Collapse, Space, Button, message, Tag, Divider } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { useCallback } from 'react'

const { Title, Paragraph, Text } = Typography

const codeBasic = `
worker_processes  auto;
events {
  worker_connections  1024;
}
http {
  server {
    listen 80;
    server_name localhost;
    location / {
      root   html;
      index  index.html;
    }
  }
}
`.trim()

const codeStatic = `
server {
  listen 80;
  server_name example.local;
  root  /var/www/site;
  index index.html;
  location /assets/ {
    alias /var/www/site/static/;
    access_log off;
    expires 7d;
  }
}
`.trim()

const codeProxy = `
server {
  listen 80;
  server_name api.local;
  location /api/ {
    proxy_pass http://127.0.0.1:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
`.trim()

const codeSpa = `
server {
  listen 80;
  server_name spa.local;
  root /var/www/spa;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
`.trim()

const codeGzip = `
http {
  gzip on;
  gzip_comp_level 5;
  gzip_min_length 1k;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml+rss;
}
`.trim()

const codeCache = `
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m inactive=60m max_size=1g;
server {
  listen 80;
  server_name cache.local;
  location /api/ {
    proxy_cache my_cache;
    proxy_cache_valid 200 302 10m;
    proxy_cache_valid 404 1m;
    add_header X-Cache-Status $upstream_cache_status;
    proxy_pass http://127.0.0.1:4000/;
  }
}
`.trim()

const codeLimit = `
http {
  limit_req_zone $binary_remote_addr zone=perip:10m rate=5r/s;
  server {
    listen 80;
    server_name limit.local;
    location /api/ {
      limit_req zone=perip burst=10 nodelay;
      proxy_pass http://127.0.0.1:5000/;
    }
  }
}
`.trim()

const codeUpstream = `
upstream app_upstream {
  server 127.0.0.1:7001;
  server 127.0.0.1:7002;
  keepalive 32;
}
server {
  listen 80;
  server_name lb.local;
  location / {
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_pass http://app_upstream;
  }
}
`.trim()

const codeLocation = `
server {
  listen 80;
  server_name match.local;
  location = /exact { return 200 'ok'; }
  location ^~ /static/ { root /var/www; }
  location ~* \\.(jpg|png|gif|css|js)$ { expires 7d; }
  location / { proxy_pass http://127.0.0.1:8080; }
}
`.trim()

const codeSelfHttps = `
server {
  listen 443 ssl;
  server_name demo.local;
  ssl_certificate     /etc/nginx/certs/demo.crt;
  ssl_certificate_key /etc/nginx/certs/demo.key;
  location / {
    proxy_pass http://127.0.0.1:8080;
  }
}
`.trim()

const codeWebSocket = `
server {
  listen 80;
  server_name ws.local;
  location /ws/ {
    proxy_pass http://127.0.0.1:3002/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
`.trim()

const codeCanary = `
split_clients "$request_id" $bucket {
  10% v2;
  *   v1;
}
upstream api_v1 { server 127.0.0.1:4001; }
upstream api_v2 { server 127.0.0.1:4002; }
server {
  listen 80;
  server_name canary.local;
  location /api/ {
    proxy_pass http://api_$bucket;
  }
}
`.trim()

const codeHealth = `
upstream app {
  server 127.0.0.1:7001 max_fails=3 fail_timeout=30s;
  server 127.0.0.1:7002 max_fails=3 fail_timeout=30s;
}
server {
  listen 80;
  server_name health.local;
  location / {
    proxy_next_upstream error timeout http_502 http_503 http_504;
    proxy_pass http://app;
  }
}
`.trim()

const codeCORS = `
server {
  listen 80;
  server_name cors.local;
  location /api/ {
    if ($request_method = 'OPTIONS') {
      add_header 'Access-Control-Allow-Origin' '*' always;
      add_header 'Access-Control-Allow-Methods' 'GET,POST,PUT,DELETE,OPTIONS' always;
      add_header 'Access-Control-Allow-Headers' 'Content-Type,Authorization' always;
      add_header 'Access-Control-Max-Age' 1728000;
      return 204;
    }
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Expose-Headers' 'Content-Length' always;
    proxy_pass http://127.0.0.1:4000;
  }
}
`.trim()

const codeSecurityHeaders = `
server {
  listen 80;
  server_name sec.local;
  add_header X-Frame-Options SAMEORIGIN always;
  add_header X-Content-Type-Options nosniff always;
  add_header Referrer-Policy no-referrer-when-downgrade always;
  add_header Content-Security-Policy "default-src 'self'" always;
  location / {
    root /var/www/site;
  }
}
`.trim()

const codeCacheKey = `
proxy_cache_path /var/cache/nginx keys_zone=api_cache:20m inactive=30m max_size=1g;
map $request_uri $no_cache {
  default 0;
  ~*/auth 1;
}
server {
  listen 80;
  server_name cachekey.local;
  location /api/ {
    proxy_cache api_cache;
    proxy_cache_key "$scheme$proxy_host$request_uri$is_args$args";
    proxy_no_cache $no_cache;
    proxy_cache_bypass $no_cache;
    add_header X-Cache-Status $upstream_cache_status;
    proxy_pass http://127.0.0.1:5000;
  }
}
`.trim()

const codeRewrite = `
server {
  listen 80;
  server_name rewrite.local;
  location /old/ {
    return 301 /new/;
  }
  location /img/ {
    rewrite ^/img/(.*)$ /assets/images/$1 last;
  }
  location / {
    proxy_pass http://127.0.0.1:8080;
  }
}
`.trim()

const codeTimeoutBuffer = `
server {
  listen 80;
  server_name buffer.local;
  location /api/ {
    proxy_connect_timeout 5s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    send_timeout 60s;
    proxy_buffering on;
    proxy_buffers 32 16k;
    proxy_busy_buffers_size 64k;
    proxy_max_temp_file_size 0;
    proxy_pass http://127.0.0.1:4000;
  }
}
`.trim()

const curlSmoke = `
curl -I http://localhost
curl -H "Accept-Encoding: gzip" -I http://localhost/static/app.js
curl -I http://api.local/api/users
`.trim()

const codeCorsPreflight = `
curl -X OPTIONS \\
  -H "Origin: https://foo.example" \\
  -H "Access-Control-Request-Method: GET" \\
  -H "Access-Control-Request-Headers: Authorization" \\
  http://cors.local/api/
`.trim()

const codeWscat = `
wscat -c ws://ws.local/ws/
`.trim()

const codeViteProxy = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\\/api/, ''),
      },
      '/ws': {
        target: 'ws://127.0.0.1:3002',
        ws: true,
      },
    },
  },
})
`.trim()

const codeViteBase = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/app/',
})
`.trim()

const codeNginxProdMatch = `
server {
  listen 80;
  server_name app.local;
  # 静态资源按 base '/app/' 部署
  location /app/ {
    root /var/www/site;    # 实际路径拼为 /var/www/site/app/index.html
    try_files $uri $uri/ /app/index.html;
  }
  # REST 接口与本地 /api 代理保持一致
  location /api/ {
    proxy_pass http://127.0.0.1:4000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
  # WebSocket 与本地 /ws 对齐
  location /ws/ {
    proxy_pass http://127.0.0.1:3002/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
`.trim()

function copy(text: string) {
  return async () => {
    try {
      await navigator.clipboard.writeText(text)
      message.success('已复制到剪贴板')
    } catch {
      message.error('复制失败')
    }
  }
}

export default function NginxLearn() {
  const copyAll = useCallback(
    () => copy(
      [
        codeBasic,
        codeStatic,
        codeProxy,
        codeSpa,
        codeGzip,
        codeCache,
        codeLimit,
        codeUpstream,
        codeLocation,
        codeSelfHttps,
        codeWebSocket,
        codeCanary,
        codeHealth,
        codeCORS,
        codeSecurityHeaders,
        codeCacheKey,
        codeRewrite,
        codeTimeoutBuffer,
        curlSmoke,
      ].join('\n\n')
    )(),
    []
  )

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space align="center" style={{ justifyContent: 'space-between' }}>
        <Title level={3} style={{ margin: 0 }}>Nginx 学习案例</Title>
        <Space>
          <Button icon={<CopyOutlined />} onClick={copyAll}>复制全部</Button>
        </Space>
      </Space>
      <Paragraph>
        <Text>常见场景的最小可用配置，便于快速理解和实践。</Text>
      </Paragraph>

      <Card title="基础配置" extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeBasic)}>复制</Button>}>
        <Paragraph>
          <Tag color="blue">master</Tag>
          <Tag color="blue">worker</Tag>
          <Tag color="blue">http</Tag>
          <Tag color="blue">server</Tag>
        </Paragraph>
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeBasic}</code></pre>
      </Card>

      <Collapse
        items={[
          {
            key: 'static',
            label: '静态站点与别名目录',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeStatic)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeStatic}</code></pre>
              </Card>
            ),
          },
          {
            key: 'proxy',
            label: '反向代理与请求头',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeProxy)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeProxy}</code></pre>
              </Card>
            ),
          },
          {
            key: 'spa',
            label: '前端单页应用回退',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeSpa)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeSpa}</code></pre>
              </Card>
            ),
          },
          {
            key: 'gzip',
            label: 'Gzip 压缩',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeGzip)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeGzip}</code></pre>
              </Card>
            ),
          },
          {
            key: 'cache',
            label: '代理缓存',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeCache)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeCache}</code></pre>
              </Card>
            ),
          },
          {
            key: 'limit',
            label: '限流控制',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeLimit)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeLimit}</code></pre>
              </Card>
            ),
          },
          {
            key: 'upstream',
            label: '负载均衡 upstream',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeUpstream)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeUpstream}</code></pre>
              </Card>
            ),
          },
          {
            key: 'location',
            label: 'location 匹配优先级',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeLocation)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeLocation}</code></pre>
              </Card>
            ),
          },
          {
            key: 'https',
            label: '自签名 HTTPS 基础',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeSelfHttps)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeSelfHttps}</code></pre>
              </Card>
            ),
          },
          {
            key: 'ws',
            label: 'WebSocket 代理',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeWebSocket)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeWebSocket}</code></pre>
              </Card>
            ),
          },
          {
            key: 'canary',
            label: '灰度发布（按请求ID切流）',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeCanary)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeCanary}</code></pre>
              </Card>
            ),
          },
          {
            key: 'health',
            label: '被动健康检查与重试',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeHealth)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeHealth}</code></pre>
              </Card>
            ),
          },
          {
            key: 'cors',
            label: 'CORS 跨域配置',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeCORS)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeCORS}</code></pre>
              </Card>
            ),
          },
          {
            key: 'security',
            label: '安全响应头',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeSecurityHeaders)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeSecurityHeaders}</code></pre>
              </Card>
            ),
          },
          {
            key: 'cachekey',
            label: '缓存键细化与跳过',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeCacheKey)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeCacheKey}</code></pre>
              </Card>
            ),
          },
          {
            key: 'rewrite',
            label: '重写与重定向',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeRewrite)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeRewrite}</code></pre>
              </Card>
            ),
          },
          {
            key: 'timeoutbuffer',
            label: '超时与缓冲优化',
            children: (
              <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeTimeoutBuffer)}>复制</Button>}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeTimeoutBuffer}</code></pre>
              </Card>
            ),
          },
        ]}
      />

      <Card title="前端要点速查">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>路由与部署路径：</Text> History 路由需 try_files 回退到 index.html；生产与构建 base 保持一致。
          </Paragraph>
          <Paragraph>
            <Text strong>反向代理与跨域：</Text> 开发用本地代理，线上 Nginx 反代；预检 OPTIONS 与 Access-Control-Allow-* 头匹配；鉴权头与 Cookie 需透传。
          </Paragraph>
          <Paragraph>
            <Text strong>WebSocket 与 SSE：</Text> 设置 Upgrade/Connection；前端统一 ws(s) 地址与路径。
          </Paragraph>
          <Paragraph>
            <Text strong>静态资源与缓存：</Text> 文件名指纹配合长缓存；HTML 短缓存；SourceMap 谨慎发布。
          </Paragraph>
          <Paragraph>
            <Text strong>压缩与体积：</Text> 开启 gzip 或 brotli；前端代码分割、按需加载、资源优化。
          </Paragraph>
          <Paragraph>
            <Text strong>安全：</Text> 配置 CSP、X-Frame-Options、X-Content-Type-Options、Referrer-Policy；前端按 CSP 白名单接入第三方。
          </Paragraph>
          <Paragraph>
            <Text strong>缓存与 CDN：</Text> 细化 proxy_cache_key；对用户态或强一致接口跳过缓存。
          </Paragraph>
          <Paragraph>
            <Text strong>错误与限流：</Text> 针对 502/504/429 建立重试与友好提示；合理退避。
          </Paragraph>
          <Collapse
            items={[
              {
                key: 'cors-preflight',
                label: 'CORS 预检命令',
                children: (
                  <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeCorsPreflight)}>复制</Button>}>
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeCorsPreflight}</code></pre>
                  </Card>
                ),
              },
              {
                key: 'wscat',
                label: 'WebSocket 连接测试',
                children: (
                  <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeWscat)}>复制</Button>}>
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeWscat}</code></pre>
                  </Card>
                ),
              },
            ]}
          />
        </Space>
      </Card>

      <Divider />
      <Card title="Vite 本地代理 ↔ 生产 Nginx 对应">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Paragraph>
            <Tag color="processing">目标</Tag> 开发与生产保持路径与行为一致：<Text code>/api</Text>（REST）、<Text code>/ws</Text>（WebSocket）、<Text code>base</Text>（静态路径）。
          </Paragraph>
          <Collapse
            items={[
              {
                key: 'vite-proxy',
                label: 'Vite 本地代理配置',
                children: (
                  <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeViteProxy)}>复制</Button>}>
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeViteProxy}</code></pre>
                  </Card>
                ),
              },
              {
                key: 'vite-base',
                label: 'Vite base 与部署子路径',
                children: (
                  <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeViteBase)}>复制</Button>}>
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeViteBase}</code></pre>
                  </Card>
                ),
              },
              {
                key: 'nginx-prod',
                label: '生产 Nginx 对应配置',
                children: (
                  <Card size="small" bordered={false} extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(codeNginxProdMatch)}>复制</Button>}>
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{codeNginxProdMatch}</code></pre>
                  </Card>
                ),
              },
            ]}
          />
        </Space>
      </Card>
      <Divider />
      <Card title="常用验证命令" extra={<Button size="small" icon={<CopyOutlined />} onClick={copy(curlSmoke)}>复制</Button>}>
        <Paragraph>
          <Text>使用简单的命令验证配置是否生效。</Text>
        </Paragraph>
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}><code>{curlSmoke}</code></pre>
      </Card>
    </Space>
  )
}

