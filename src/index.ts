import * as fs from 'fs';
import path from 'path';
import { webSourceConf, Config } from './config';
import { CheckManager, ConnectionStatus } from './CheckManager';
import { MarkdownReplacer } from './MarkdownReplacer';
class Manager {
  constructor(public conf: Config) { }

  private webMediaSources: ExportedMediaSourceData[] = []
  private connectStatus: ConnectionStatus[] = []
  private markdownReplacer: MarkdownReplacer = new MarkdownReplacer()
  private checkManager: CheckManager = new CheckManager()
  // 从文件中获取媒体源数组
  async getMediaSourceFromFile() : Promise<ExportedMediaSourceData[]>{
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
  replaceMarkdown() {
    const str = this.connectStatus.map((connectionStatus) => {
      return `| ${connectionStatus.name} | ${connectionStatus.website} | ${connectionStatus.isSuccess ? Emoji.CheckMark : Emoji.X}   | `
    }).join('\n')
    this.markdownReplacer.replaceMarkdown(str)
  }

  async workflow() {
    this.webMediaSources = await this.getMediaSourceFromFile()
    this.connectStatus = await this.checkManager.getConnectionStatus(this.webMediaSources)

    const connectErrorSourceNames = this.connectStatus.filter(status => !status.isSuccess).map(status => status.name)
    this.webMediaSources = this.webMediaSources.filter(source => !connectErrorSourceNames.includes(source.arguments['name']))
    this.mergeSource()
    this.replaceMarkdown()
  }
}

enum Emoji {
  CheckMark = ':heavy_check_mark:', 
  X = ':x:'
}
function main() {
  new Manager(webSourceConf).workflow()
}
main()