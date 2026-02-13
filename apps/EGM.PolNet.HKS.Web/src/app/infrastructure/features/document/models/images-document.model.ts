export class ImagesDocumentModel {
  type: string;
  format: string;
  imageUrl: string;

  constructor(data: any, format: string = 'data:image/jpeg;base64,') {
    this.type = data.Message;
    this.format = format;
    this.imageUrl = data.Data;
  }
}