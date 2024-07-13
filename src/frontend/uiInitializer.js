import { appendNewExtractedExcelItem } from './extracterHelper';

export async function displayExtractedItems() {
  try {
    /**
     * @type {{filePath:string; date:number, fileName:string, numberOfExtractedAuthors:number}[]}
     */
    const extractedItems = await window.context.getExtractedItems();
    extractedItems.forEach((i) => {
      appendNewExtractedExcelItem(
        i.filePath,
        i.date,
        i.numberOfExtractedAuthors,
        i.fileName
      );
    });
  } catch (err) {
    console.error(err);
  }
}
