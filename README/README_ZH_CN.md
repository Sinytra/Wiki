# Sinytra Minecraft 模组维基

欢迎来到 Minecraft 模组维基，这是一个供所有人托管和分享他们的模组文档的公共平台。

Minecraft 模组维基旨在满足 Minecraft 模组制作者和玩家的需求。它提供了直观的导航，清晰的用户界面，模组浏览器以及供作者轻松编写文档的功能。

这些功能包括版本控制，本地化，自定义组件（配方，资源等）， gradle 集成，项目管理等等。

- 🌐 **本地化**：将您的文档翻译成世界语言
- 🚹 **可访问性**：直观且响应式的用户界面
- 🤝 **开放**：让您的用户无需任何编程知识即可参与贡献
- 💸 **免费**：在我们的网站上托管文档完全免费！

## 作者

本仓库的 `example` 目录中包含一个示例文档设置。

## 开发

1. 将 `.env.local.example` 重命名为 `.env.local`
2. 创建一个新的 [GitHub 应用程序](https://github.com/settings/apps/new)。填写以下信息：
   - `APP_AUTH_GITHUB_ID` - 应用程序 ID
   - `APP_AUTH_GITHUB_PRIVATE_KEY` - 生成的 [私钥](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/managing-private-keys-for-github-apps)
   - `AUTH_GITHUB_ID` - 客户端 ID
   - `AUTH_GITHUB_SECRET` - 客户端密钥
3. 运行 `npm run dev` 启动应用程序

您可以在 `LOCAL_DOCS_ROOTS` 环境变量中列出所需的本地文档源，如示例所示。

## 致谢

_（请参阅英文 README 的 Credits 部分）_
