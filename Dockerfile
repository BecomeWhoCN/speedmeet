# 使用 Python 官方基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制应用文件到容器中
COPY . /app

# 安装依赖项
RUN pip install --no-cache-dir -r requirements.txt

# 开放应用服务的端口
EXPOSE 5000

# 设置 Flask 的启动命令
CMD ["python", "app.py"]