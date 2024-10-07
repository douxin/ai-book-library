# ai-book-library

这是一个可以在本地管理和阅读 epub 图书的系统，已适配手机端。我后续会补充 README 的信息。

## 安装和启动

1. 克隆项目到本地:
   ```
   git clone https://github.com/douxin/ai-book-library.git
   ```

2. 进入项目目录:
   ```
   cd ai-book-library
   ```

3. 安装依赖:
   ```
   npm install
   ```

4. 启动开发服务器:
   ```
   npm run start
   ```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 图书管理

### 添加图书
将图书放置在 `public/books` 文件夹中，目前仅支持 epub 格式。

### 提取图书信息
运行 `npm run extract-books` 可以提取图书信息，并保存到 `src/data/books.json` 中。本系统会从这个 json 文件中读取图书信息。

提取完成后，刷新页面，就可以使用了。