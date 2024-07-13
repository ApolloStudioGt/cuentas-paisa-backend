import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import {
  BufferOptions,
  CustomTableLayout,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import * as path from 'path';

const fonts = {
  Roboto: {
    normal: path.join(
      __dirname,
      'assets',
      'fonts',
      'roboto',
      'Roboto-Medium.ttf',
    ),
    bold: path.join(
      __dirname,
      'assets',
      'fonts',
      'roboto',
      'Roboto-Bold.ttf',
    ),
    italics: path.join(
      __dirname,
      'assets',
      'fonts',
      'roboto',
      'Roboto-Italic.ttf',
    ),
    bolditalics: path.join(
      __dirname,
      'assets',
      'fonts',
      'roboto',
      'Roboto-MediumItalic.ttf',
    ),
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

const isSaleRow = (cell: any): boolean => {
  return (
    typeof cell === 'object' &&
    'text' in cell &&
    typeof cell.text === 'string' &&
    cell.text.trim() !== ''
  );
};

const customerBalanceDetailLayout: Record<string, CustomTableLayout> = {
  customDetailLayout: {
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
      return i === 1 ? 'black' : '#E5E7E9';
    },
    paddingLeft: function (i) {
      return i === 0 ? 0 : 8;
    },
    paddingRight: function (i, node) {
      return i === node.table.widths.length - 1 ? 0 : 8;
    },
    fillColor: function (i, node) {
      if (i === 0) {
        return '#CACFD2';
      }
      const row = node.table.body[i];
      return isSaleRow(row[0]) ? '#F4F6F7' : '#FFFFFF';
    },
  },
};

@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fonts);

  createPdf(
    docDefinition: TDocumentDefinitions,
    options: BufferOptions = {},
  ): PDFKit.PDFDocument {
    options.tableLayouts = {
      ...customerBalanceLayout,
      ...customerBalanceDetailLayout,
    };
    return this.printer.createPdfKitDocument(docDefinition, options);
  }
}
