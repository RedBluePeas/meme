# Docker 部署文档

## 概述

本项目使用 Docker 和 Docker Compose 实现容器化部署，包含以下服务：

- **Backend**: Node.js + TypeScript 后端应用
- **PostgreSQL**: 主数据库
- **MongoDB**: 消息存储
- **Redis**: 缓存和会话管理

## 前置要求

- Docker 20.10+
- Docker Compose 2.0+

## 快速开始

### 生产环境部署

1. **克隆项目**
```bash
git clone <repository-url>
cd social-chat-backend
```

2. **配置环境变量**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，设置生产环境配置
vim .env
```

重要：确保修改以下配置：
- `JWT_SECRET`: 设置一个强密钥
- `DATABASE_PASSWORD`: 设置数据库密码
- `CORS_ORIGIN`: 设置允许的前端域名

3. **启动所有服务**
```bash
docker-compose up -d
```

4. **查看服务状态**
```bash
docker-compose ps
```

5. **查看日志**
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
```

6. **运行数据库迁移**
```bash
docker-compose exec backend npm run migrate:latest
```

7. **访问应用**
- API: http://localhost:3000/api
- API 文档: http://localhost:3000/api-docs
- 健康检查: http://localhost:3000/health

### 开发环境部署

1. **启动开发环境**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

开发环境特点：
- 支持代码热重载
- 挂载本地源代码
- 更宽松的速率限制
- 详细的日志输出

2. **进入容器调试**
```bash
docker-compose exec backend sh
```

3. **重启服务**
```bash
docker-compose -f docker-compose.dev.yml restart backend
```

## 常用命令

### 容器管理

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 停止服务并删除卷（危险！会删除数据）
docker-compose down -v

# 重启服务
docker-compose restart

# 重启特定服务
docker-compose restart backend
```

### 日志查看

```bash
# 实时查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f postgres
docker-compose logs -f mongodb
docker-compose logs -f redis
docker-compose logs -f backend

# 查看最近100行日志
docker-compose logs --tail=100 backend
```

### 数据库操作

```bash
# 进入 PostgreSQL
docker-compose exec postgres psql -U postgres -d social_chat

# 进入 MongoDB
docker-compose exec mongodb mongosh -u admin -p admin123

# 进入 Redis
docker-compose exec redis redis-cli

# 运行数据库迁移
docker-compose exec backend npm run migrate:latest

# 回滚数据库迁移
docker-compose exec backend npm run migrate:rollback
```

### 备份和恢复

```bash
# 备份 PostgreSQL 数据库
docker-compose exec postgres pg_dump -U postgres social_chat > backup.sql

# 恢复 PostgreSQL 数据库
docker-compose exec -T postgres psql -U postgres social_chat < backup.sql

# 备份 MongoDB 数据库
docker-compose exec mongodb mongodump --uri="mongodb://admin:admin123@localhost:27017/social_chat?authSource=admin" --out=/data/backup

# 恢复 MongoDB 数据库
docker-compose exec mongodb mongorestore --uri="mongodb://admin:admin123@localhost:27017/social_chat?authSource=admin" /data/backup
```

## 性能优化

### 生产环境配置

1. **限制资源使用**

编辑 `docker-compose.yml`，添加资源限制：

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

2. **启用日志轮转**

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

3. **使用健康检查**

所有服务都配置了健康检查，确保服务正常运行。

### 监控

```bash
# 查看资源使用情况
docker stats

# 查看特定容器资源使用
docker stats social-chat-backend
```

## 网络配置

所有服务在同一个网络 `social-chat-network` 中，服务间可以通过服务名互相访问：

- Backend 访问 PostgreSQL: `postgres:5432`
- Backend 访问 MongoDB: `mongodb:27017`
- Backend 访问 Redis: `redis:6379`

## 卷管理

数据持久化卷：

- `postgres_data`: PostgreSQL 数据
- `mongodb_data`: MongoDB 数据
- `redis_data`: Redis 数据

```bash
# 查看卷
docker volume ls

# 删除未使用的卷
docker volume prune

# 查看卷详情
docker volume inspect social-chat-backend_postgres_data
```

## 故障排查

### 服务无法启动

1. 检查端口是否被占用
```bash
lsof -i :3000
lsof -i :5432
lsof -i :27017
lsof -i :6379
```

2. 查看服务日志
```bash
docker-compose logs backend
```

3. 检查依赖服务状态
```bash
docker-compose ps
```

### 数据库连接失败

1. 确认数据库服务健康
```bash
docker-compose ps postgres
```

2. 测试数据库连接
```bash
docker-compose exec postgres pg_isready -U postgres
```

3. 检查环境变量配置
```bash
docker-compose exec backend env | grep DATABASE
```

### 容器频繁重启

1. 查看健康检查状态
```bash
docker inspect social-chat-backend | grep -A 10 Health
```

2. 检查资源使用
```bash
docker stats
```

## 安全建议

1. **不要在生产环境使用默认密码**
   - 修改 PostgreSQL 密码
   - 修改 MongoDB 密码
   - 生成强 JWT_SECRET

2. **限制端口暴露**
   - 只暴露必要的端口
   - 使用反向代理（Nginx）

3. **定期备份数据**
   - 设置自动备份脚本
   - 定期测试恢复流程

4. **更新镜像**
```bash
docker-compose pull
docker-compose up -d
```

## CI/CD 集成

### GitHub Actions 示例

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build and deploy
        run: |
          docker-compose build
          docker-compose up -d
```

### 自动化部署脚本

```bash
#!/bin/bash
# deploy.sh

echo "Pulling latest code..."
git pull

echo "Building containers..."
docker-compose build

echo "Stopping old containers..."
docker-compose down

echo "Starting new containers..."
docker-compose up -d

echo "Running migrations..."
docker-compose exec -T backend npm run migrate:latest

echo "Deployment complete!"
```

## 扩展

### 水平扩展

```bash
# 启动多个后端实例
docker-compose up -d --scale backend=3
```

需要配置负载均衡器（如 Nginx）分发流量。

### 使用外部数据库

如果使用外部托管的数据库（如 AWS RDS），修改 `docker-compose.yml` 中的环境变量，并删除对应的数据库服务。

## 参考资源

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
