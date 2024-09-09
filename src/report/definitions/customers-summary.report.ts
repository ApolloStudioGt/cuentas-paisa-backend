import { TDocumentDefinitions } from 'pdfmake/interfaces';
import {
  GetCustomerDebt,
  Transaction,
} from 'src/customer/interfaces/get-customer-debt';
import { DateFormatter } from '../helpers';
import { headerSection, footerSection } from '../sections';
import { text } from 'stream/consumers';

interface ReportOptions {
  customers: GetCustomerDebt[];
}

export const getCustomerSummaryReport = (
  options: ReportOptions,
): TDocumentDefinitions => {
  const { customers } = options;

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const content = [];

  customers.forEach((customer, index) => {
    let totalSalesAmount = 0;
    let totalPaymentsAmount = 0;
    let currentDebt = 0;

    const salesAndPayments = customer.transactions.reduce<any[]>((acc, transaction) => {
      let row: any[] = [];
      if (transaction.transactionType === 'sale') {
        totalSalesAmount += transaction.amount;
        if (currentDebt === 0) {
          currentDebt = transaction.amount;
        } else {
          currentDebt += transaction.amount;
        }
        acc.push([
          {
            text: 'Venta',
            alignment: 'center',
            valign: 'middle',
          },
          {
            text: transaction.docReference,
            alignment: 'center',
            valign: 'middle',
          },
          {
            text: transaction.description,
            alignment: 'center',
            valign: 'middle',
          },
          {
            text: DateFormatter.getDDMMYYYY(transaction.createdAt),
            alignment: 'center',
            valign: 'middle',
          },
          {
            text: `Q. ${formatAmount(transaction.amount)}`,
            alignment: 'center',
            valign: 'middle',
          },
          {
            text: '',
            alignment: 'center',
            valign: 'middle',
          },
          {
            text: `Q.${formatAmount(currentDebt)}`,
            alignment: 'center',
            valign: 'middle',
          },  
        ]);
      } else if (transaction.transactionType === 'payment') {
        totalPaymentsAmount += transaction.amount;
        currentDebt -= transaction.amount;
        acc.push([
          {
            text: 'Pago',
            alignment: 'center',
            valign: 'middle',
          },
          {
            text: transaction.docReference,
            alignment: 'center',
            valign: 'middle',
          },
          {
            text: transaction.description,
            alignment: 'center',
            valign: 'middle',
          },
          {
            text: DateFormatter.getDDMMYYYY(transaction.createdAt),
            alignment: 'center',
            valign: 'middle',
          },
          {
            text: `Q. ${formatAmount(transaction.amount)}`,
            alignment: 'center',
            valign: 'middle',
          },
          {
            text: transaction.docAuthorization || transaction.bankDescription || '',
            alignment: 'center',
            valign: 'middle',
          },
          {
            text: `Q. ${formatAmount(currentDebt)}`,
            alignment: 'center',
            valign: 'middle',
          },
        ]);
      }
      return acc;
    }, []);

    content.push(
      {
        text: 'DATOS DEL CLIENTE',
        style: {
          fontSize: 15,
          bold: true,
        },
        margin: [0, -15, 0, 0],
      },
      {
        layout: 'noBorders',
        table: {
          headerRows: 1,
          widths: ['auto', 'auto'],
          body: [
            [
              {
                text: 'Nombre: ',
                bold: true,
              },
              {
                text: `${customer.fullName}`,
              },
            ],
            [
              {
                text: 'NIT: ',
                bold: true,
              },
              {
                text: `${customer.nit}`,
              },
            ],
            [
              {
                text: 'Email: ',
                bold: true,
              },
              {
                text: `${customer.email}`,
              },
            ],
            [
              {
                text: 'Teléfono: ',
                bold: true,
                margin: [0, 0, 0, 15],
              },
              {
                text: `${customer.phone}`,
              },
            ],
          ],
        },
      },
      {
        layout: 'customDetailLayout',
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', 80, 80, '*', 80],
          body: [
            [
              {
                text: 'Tipo de Transacción',
                bold: true,
                alignment: 'center',
                valign: 'middle',
              },
              {
                text: 'Documento de Referencia',
                bold: true,
                alignment: 'center',
                valign: 'middle',
              },
              {
                text: 'Descripción',
                bold: true,
                alignment: 'center',
                valign: 'middle',
              },
              {
                text: 'Fecha',
                bold: true,
                alignment: 'center',
                valign: 'middle',
              },
              {
                text: 'Monto',
                bold: true,
                alignment: 'center',
                valign: 'middle',
              },
              {
                text: 'Banco/Autorización',
                bold: true,
                alignment: 'center',
                valign: 'middle',
              },
              {
                text: 'Saldo',
                bold: true,
                alignment: 'center',
                valign: 'middle',
              },
            ],
            ...salesAndPayments,
          ],
        },
      },
      {
        text: '',
        margin: [0, 15],
      },
      {
        text: 'TOTALES',
        style: {
          fontSize: 16,
          bold: true,
          margin: [0, 60, 0, 0],
        },
      },
      {
        layout: 'noBorders',
        table: {
          headerRows: 1,
          widths: ['auto', 'auto'],
          body: [
            [
              {
                text: 'Ventas: ',
                bold: true,
              },
              {
                text: `Q. ${formatAmount(totalSalesAmount)}`,
              },
            ],
            [
              {
                text: 'Pagos: ',
                bold: true,
              },
              {
                text: `Q. ${formatAmount(totalPaymentsAmount)}`,
              },
            ],
            [
              {
                text: 'Pendiente: ',
                bold: true,
              },
              {
                text: `Q. ${formatAmount(currentDebt)}`,
              },
            ],
          ],
        },
      },
    );

    if (index !== customers.length - 1) {
      content.push({ text: '', pageBreak: 'before' });
    }
  });

  return {
    pageOrientation: 'landscape',
    header: headerSection({
      title: 'RESUMEN DE TRANSACCIONES DE CLIENTES',
      subTitle: 'PAISA BOMBAS',
      showLogo: true,
      showDate: true,
    }),
    footer: footerSection,
    pageMargins: [50, 150, 50, 60],
    content,
  };
};
