import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import {
  BufferOptions,
  CustomTableLayout,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: 'fonts/roboto/Roboto-Regular.ttf',
    bold: 'fonts/roboto/Roboto-Medium.ttf',
    italics: 'fonts/roboto/Roboto-Italic.ttf',
    bolditalics: 'fonts/roboto/Roboto-MediumItalic.ttf',
  },
};

const customerBalanceLayout: Record<string, CustomTableLayout> = {
  customLayout: {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        return 0;
      }
      return i === node.table.headerRows ? 2 : 1;
    },
    vLineWidth: function () {
      return 0;
    },
    hLineColor: function (i) {
      return i === 1 ? 'black' : '#AAA';
    },
    paddingLeft: function (i) {
      return i === 0 ? 0 : 8;
    },
    paddingRight: function (i, node) {
      return i === node.table.widths.length - 1 ? 0 : 8;
    },
    fillColor: function (i) {
      if (i === 0) {
        return '#CACFD2';
      }
      return i % 2 === 0 ? '#F3F3F3' : null;
    },
  },
};

@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fonts);

  createPdf(
    docDefinition: TDocumentDefinitions,
    options: BufferOptions = {
      tableLayouts: customerBalanceLayout,
    },
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition, options);
  }
}
