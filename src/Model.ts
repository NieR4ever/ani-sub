type FactoryId = string; // 假设 FactoryId 是字符串类型，如果有其他类型可以修改

type MediaSourceArguments = any;

interface ExportedMediaSourceData {
    factoryId: FactoryId;  
    version: number;  
    arguments: MediaSourceArguments;  // MediaSourceArguments 序列化后的数据，可以是任意的 JSON 元素
}

interface ExportedMediaSourceDataList {
    mediaSources: ExportedMediaSourceData[];  
}

interface ExportedMediaSourceDataListObject {
    exportedMediaSourceDataList: ExportedMediaSourceDataList
}