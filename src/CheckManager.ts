
export interface ConnectionStatus {
  name: string
  website: string,
  isSuccess: boolean
}
export class CheckManager {
  constructor(private exportedMediaSourceDatas: ExportedMediaSourceData[]) { }
  getConnectionStatus(): Promise<ConnectionStatus[]> {
    return Promise.all(this.exportedMediaSourceDatas.map(async (data) => {
      const searchUrl = data.arguments['searchConfig']['searchUrl']
      const url = this.tryGetVaildUrl(searchUrl)
      var isSuccess: boolean
      const response = await fetch(url).catch(reason => {
        return Response.error()
      })
      isSuccess = response.status === 200
      return {
        name: data.arguments['name'],
        website: url instanceof URL ? url.origin : url,
        isSuccess: isSuccess
      }
    }))
  }
  private tryGetVaildUrl(url: string) {
    try {
      return new URL(url)
    } catch (error) {
      return url
    }
  }
}