# 如何添加自定义在线源
这里以[风车动漫](https://vdm10.com/)为例
1. 找到一个在线看番剧的网站
2. 搜索关键词，例如：少女
3. 点击键盘上的`f12`打开控制台
4. 根据图片的序号点击
5. 复制出 css 选择器
6. 重复 4，5 步骤
7. 此时获取到如下字符串
```
// 哭泣少女乐队
div.reusltbox:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)

// 军人少女！
div.reusltbox:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)
```
8. 可以观察到有些微不同，此时将不同的地方删除得到
```
div.reusltbox > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)
```
9. 将得到的链接复制到控制台中验证