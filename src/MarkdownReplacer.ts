import * as fs from 'fs';
export class MarkdownReplacer {
    private header: string = `
    | 名称 | 网址 | 连接情况 | 
| ------- | ------- | ------- | 
    `.trim()
    private replaceStart = "<!-- REPLACE_START -->"
    private replaceEnd = "<!-- REPLACE_END -->"
  async replaceMarkdown(str: string) {
    const content: string = await fs.promises.readFile('README.md', "utf-8")
    const replace = content.replace(/<!-- REPLACE_START -->([\s\S]*?)<!-- REPLACE_END -->/, `${this.replaceStart}\n${this.header}\n${str}\n${this.replaceEnd}`)
    fs.promises.writeFile("README.md", replace, 'utf8');
  }
}