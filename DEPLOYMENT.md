# GFD 部署指南

本文档介绍如何将GFD应用部署到各种环境中。

## 📋 部署前准备

### 环境要求
- Node.js >= 18.0.0 (生产环境推荐使用LTS版本)
- 至少 256MB 内存
- 至少 1GB 磁盘空间

### 构建生产版本
在部署之前，需要先构建生产版本：

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build

# 检查构建产物
ls dist/
```

构建完成后，所有产物会生成在 `dist/` 目录下。

## 🚀 部署方式

### 方式1：直接部署（最简单）

#### 步骤1：复制文件到服务器
```bash
# 复制必要文件
scp package.json pnpm-lock.yaml dist/ user@your-server:/opt/gfd-app/
```

#### 步骤2：在服务器上安装生产依赖
```bash
ssh user@your-server
cd /opt/gfd-app/
pnpm install --production
```

#### 步骤3：使用进程管理器启动应用
推荐使用 `pm2` 作为进程管理器：

```bash
# 安装pm2（如果未安装）
npm install -g pm2

# 启动应用
pm2 start dist/main.js --name gfd-app

# 查看运行状态
pm2 status

# 查看日志
pm2 logs gfd-app

# 设置开机自启
pm2 startup
pm2 save
```

#### 步骤4：验证部署
```bash
# 检查应用是否正常运行
curl http://localhost:3000/health
```

### 方式2：Docker部署

#### 步骤1：创建Dockerfile
在项目根目录创建 `Dockerfile`：
```dockerfile
# 使用官方Node.js镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile --production

# 复制构建产物
COPY dist/ ./dist/

# 暴露端口（根据你的应用配置调整）
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main.js"]
```

#### 步骤2：创建.dockerignore文件
```
node_modules/
dist/
.git/
.github/
tests/
docs/
*.log
.DS_Store
```

#### 步骤3：构建Docker镜像
```bash
docker build -t gfd-app:latest .
```

#### 步骤4：运行容器
```bash
docker run -d \
  --name gfd-app \
  -p 3000:3000 \
  --restart always \
  -e NODE_ENV=production \
  -e DATABASE_URL=your-database-url \
  gfd-app:latest
```

#### 步骤5：验证部署
```bash
docker ps | grep gfd-app
docker logs gfd-app
```

### 方式3：Kubernetes部署

#### 步骤1：创建Deployment配置
创建 `k8s/deployment.yaml`：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gfd-app
  labels:
    app: gfd-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: gfd-app
  template:
    metadata:
      labels:
        app: gfd-app
    spec:
      containers:
      - name: gfd-app
        image: your-registry/gfd-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: gfd-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
```

#### 步骤2：创建Service配置
创建 `k8s/service.yaml`：
```yaml
apiVersion: v1
kind: Service
metadata:
  name: gfd-service
spec:
  type: LoadBalancer
  selector:
    app: gfd-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```

#### 步骤3：创建Secret配置
创建 `k8s/secret.yaml`：
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: gfd-secrets
type: Opaque
data:
  database-url: <base64-encoded-database-url>
```

#### 步骤4：部署到Kubernetes
```bash
# 应用配置
kubectl apply -f k8s/

# 查看部署状态
kubectl get deployments
kubectl get pods
kubectl get services
```

### 方式4：Serverless部署（Vercel/Netlify）

#### Vercel部署配置
创建 `vercel.json`：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## ⚙️ 配置管理

### 环境变量配置
GFD推荐使用环境变量进行配置：

```bash
# 基础配置
export NODE_ENV=production
export APP_NAME="GFD Application"
export APP_VERSION=1.0.0
export PORT=3000
export HOST=0.0.0.0

# 数据库配置
export DATABASE_URL=postgresql://user:password@host:5432/dbname

# 日志配置
export LOG_LEVEL=info
export LOG_FORMAT=json

# 第三方服务配置
export REDIS_URL=redis://host:6379
export API_KEY=your-api-key
```

### 配置文件
也可以使用配置文件，创建 `config/production.yaml`：
```yaml
app:
  name: "GFD Application"
  version: "1.0.0"
  environment: "production"

server:
  port: 3000
  host: "0.0.0.0"

database:
  url: "${DATABASE_URL}"

logger:
  level: "info"
  format: "json"
```

## 🔒 安全最佳实践

1. **使用非root用户运行应用**
   ```dockerfile
   # 在Dockerfile中添加
   RUN addgroup -S appgroup && adduser -S appuser -G appgroup
   USER appuser
   ```

2. **不要在镜像中包含敏感信息**
   - 所有敏感配置通过环境变量注入
   - 使用Secret管理敏感数据

3. **开启HTTPS**
   - 生产环境必须使用HTTPS
   - 推荐使用Let's Encrypt免费证书
   - 使用反向代理（Nginx/Caddy）处理SSL

4. **配置CSP（内容安全策略）**
   ```typescript
   // 在应用中配置CSP
   app.use((req, res, next) => {
     res.setHeader('Content-Security-Policy', "default-src 'self'");
     next();
   });
   ```

5. **定期更新依赖**
   ```bash
   # 检查安全漏洞
   npm audit
   pnpm audit

   # 修复安全问题
   npm audit fix
   ```

## 📊 监控和日志

### 日志配置
生产环境推荐使用JSON格式日志：

```typescript
const logger = new Logger({
  level: 'info',
  format: 'json', // 生产环境使用json格式
  enableColors: false, // 生产环境关闭颜色
  filePath: '/var/log/gfd/app.log' // 可选：输出到文件
});
```

### 健康检查接口
建议实现健康检查接口：

```typescript
import { Plugin, GFD } from '@gfd/core';

export class HealthPlugin extends Plugin {
  name = 'health-check';
  version = '1.0.0';

  async install(gfd: GFD) {
    gfd.api.register('health:check', () => {
      return {
        status: 'ok',
        timestamp: Date.now(),
        version: gfd.config.version,
        uptime: process.uptime()
      };
    });
  }
}
```

### 性能监控
集成APM工具（如New Relic、Datadog、OpenTelemetry）：

```typescript
// 在应用入口最顶部引入
import 'newrelic';

// 或使用OpenTelemetry
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();
```

## 🔄  CI/CD 示例

### GitHub Actions 配置
创建 `.github/workflows/deploy.yml`：
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
      
    - name: Lint code
      run: pnpm lint
      
    - name: Run tests
      run: pnpm test
      
    - name: Build
      run: pnpm build
      
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ secrets.DOCKER_REGISTRY }}/gfd-app:${{ github.sha }}
        
    - name: Deploy to Kubernetes
      uses: steebchen/kubectl@v2
      with:
        config: ${{ secrets.KUBE_CONFIG }}
        command: set image deployment/gfd-app gfd-app=${{ secrets.DOCKER_REGISTRY }}/gfd-app:${{ github.sha }}
```

## 🚨 故障排查

### 应用无法启动
1. 检查日志：`pm2 logs gfd-app` 或 `docker logs gfd-app`
2. 确认配置是否正确：`printenv | grep NODE_ENV`
3. 检查端口是否被占用：`netstat -tlnp | grep 3000`
4. 确认依赖是否完整：`pnpm list`

### 性能问题
1. 检查CPU和内存使用：`top` 或 `htop`
2. 分析GC日志：`node --trace-gc dist/main.js`
3. 使用clinic.js进行性能分析：
   ```bash
   npm install -g clinic
   clinic doctor -- node dist/main.js
   ```

### 内存泄漏
1. 使用Chrome DevTools调试：
   ```bash
   node --inspect=0.0.0.0:9229 dist/main.js
   ```
2. 在Chrome中打开 `chrome://inspect` 进行调试
3. 使用heapdump生成堆快照：
   ```typescript
   import heapdump from 'heapdump';
   
   // 每隔5分钟生成一次堆快照
   setInterval(() => {
     const filename = `heap-${Date.now()}.heapsnapshot`;
     heapdump.writeSnapshot(filename, (err) => {
       if (err) console.error('Failed to write heap snapshot:', err);
       else console.log('Heap snapshot written to:', filename);
     });
   }, 5 * 60 * 1000);
   ```

## 📈 扩容策略

### 垂直扩容
- 增加服务器CPU和内存
- 调整Node.js内存限制：
  ```bash
  node --max-old-space-size=1024 dist/main.js # 限制为1GB内存
  ```

### 水平扩容
- 使用负载均衡器分发流量
- 部署多个实例，通过Redis共享状态
- 开启Session粘滞（如果需要）

### 无状态设计
- 所有状态存储在外部（数据库、Redis等）
- 应用本身不存储任何状态
- 方便随时扩容和缩容

## 📝 部署检查清单

部署前请确认以下事项：

- [ ] 代码已经过完整测试，所有测试用例通过
- [ ] 所有安全漏洞已修复（`pnpm audit` 无高危漏洞）
- [ ] 配置文件使用环境变量，没有硬编码敏感信息
- [ ] 日志配置正确，输出JSON格式
- [ ] 健康检查接口正常工作
- [ ] 进程管理器配置正确，有自动重启机制
- [ ] 监控和告警已配置
- [ ] 回滚方案已准备好
- [ ] 已进行压力测试，性能符合预期

## 📚 相关文档

- [README.md](./README.md) - 完整的开发文档
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始指南
- [API文档](./docs/api/) - 详细的API参考

如果在部署过程中遇到问题，请查看GitHub Issues或提交新的Issue。
