import * as fs from 'fs';
import path from 'path';
import { webSourceConf, Config, btSourceConf } from './config';
import { CheckManager, ConnectionStatus } from './CheckManager';
class Manager {
  constructor(public conf: Config) { }

  private webMediaSources: ExportedMediaSourceData[] = []
  private connectStatus: ConnectionStatus[] = []
  // 从文件中获取媒体源数组
  async getMediaSourceFromFile() {
    const filenames = await fs.promises.readdir(this.conf.sourceDir); // 获取文件名列表

    return Promise.all(filenames.map(name => {
      return fs.promises.readFile(path.join(this.conf.sourceDir, name), 'utf8');
    })).then(data => {
      return data.map(d => JSON.parse(d))
    })
  }

  // 合并源
  async mergeSource() {
    const obj: ExportedMediaSourceDataListObject = {
      exportedMediaSourceDataList: {
        mediaSources: this.webMediaSources
      }
    }

    const formattedJson = JSON.stringify(obj, null, this.conf.isDebug ? 2 : 0)
    fs.promises.writeFile(this.conf.ouputFile, formattedJson, 'utf8');
  }
  //替换markdown
  async replaceMarkdown() {
    const header: string = `
    | 名称 | 网址 | 连接情况 | 
| ------- | ------- | ------- | 
    `.trim()
    const replaceStart = "<!-- REPLACE_START -->"
    const replaceEnd = "<!-- REPLACE_END -->"
    const str = this.connectStatus.map((connectionStatus) => {
      return `| ${connectionStatus.name} | ${connectionStatus.website} | ${connectionStatus.isSuccess ? Emoji.CheckMark : Emoji.X}   | `
    }).join('\n')
    const content: string = await fs.promises.readFile('README.md', "utf-8")
    const replace = content.replace(/<!-- REPLACE_START -->([\s\S]*?)<!-- REPLACE_END -->/, `${replaceStart}\n${header}\n${str}\n${replaceEnd}`)
    fs.promises.writeFile("README.md", replace, 'utf8');
  }

  checkConnection() {
    return new CheckManager(this.webMediaSources).getConnectionStatus()
  }

  async workflow() {
    this.webMediaSources = await this.getMediaSourceFromFile()
    this.connectStatus = await this.checkConnection()

    const names = this.connectStatus.filter(status => !status.isSuccess).map(status => status.name)
    this.webMediaSources = this.webMediaSources.filter(source => !names.includes(source.arguments['name']))
    this.mergeSource()
    this.replaceMarkdown()
  }
}

enum Emoji {
  CheckMark = ':heavy_check_mark:', X = ':x:'
}
function main() {
  new Manager(webSourceConf).workflow()
}
main()