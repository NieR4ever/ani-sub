export interface ConnectionStatus {
  name: string
  website: string,
  isSuccess: boolean
}
export class CheckManager {
  getConnectionStatus(exportedMediaSourceDatas: ExportedMediaSourceData[]): Promise<ConnectionStatus[]> {
    return Promise.all(exportedMediaSourceDatas.map(async (data) => {
      const searchUrl = data.arguments['searchConfig']['searchUrl']
      const url = this.tryGetVaildUrl(searchUrl)
      console.log(url)
      var isSuccess: boolean
      const response = await fetch(url).catch(reason => {
        return Response.error()
      })
      isSuccess = response.status === 200
      return {
        name: data.arguments['name'],
        website: url,
        isSuccess: isSuccess
      }
    }))
  }
  private tryGetVaildUrl(url: string) {
    try {
      return new URL(url).origin
    } catch (error) {
      return url
    }
  }
}