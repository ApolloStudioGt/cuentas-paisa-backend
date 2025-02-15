import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { CustomerTransactionDto } from '../dto/detail-customer-balance.dto';
import { DateFormatter } from '../helpers';
import { footerSection, headerSection } from '../sections';

interface ReportOptions {
  fullName: string;
  nit: string;
  email: string;
  phone: string;
  transactions: CustomerTransactionDto[];
}

export const getCustomerBalanceDetailReport = (
  options: ReportOptions,
): TDocumentDefinitions => {
  const { fullName, nit, email, phone, transactions } = options;

  let totalSalesAmount = 0;
  let totalPaymentsAmount = 0;

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const header = [
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
  ];

  let currentDebt = 0;

  const content = transactions.map((transaction) => {
    let transactionTypeText = '';
    let additionalInfo = '';

    if (transaction.transactionType === 'sale') {
      transactionTypeText = 'Venta';
      totalSalesAmount += transaction.amount;
    } else if (transaction.transactionType === 'payment') {
      transactionTypeText = 'Pago';
      totalPaymentsAmount += transaction.amount;
      additionalInfo = `${transaction.bankDescription || ''} / ${transaction.docAuthorization || ''}`;
    }

    currentDebt +=
      transaction.transactionType === 'sale'
        ? transaction.amount
        : -transaction.amount;

    return [
      {
        text: transactionTypeText,
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
        text: DateFormatter.getDDMMYYYY(
          transaction.paidAt ?? transaction.soldAt,
        ),
        alignment: 'center',
        valign: 'middle',
      },
      {
        text: `Q. ${formatAmount(transaction.amount)}`,
        alignment: 'center',
        valign: 'middle',
      },
      {
        text: additionalInfo,
        alignment: 'center',
        valign: 'middle',
      },
      {
        text: `Q. ${formatAmount(currentDebt)}`,
        alignment: 'center',
        valign: 'middle',
      },
    ];
  });

  const totalAmount = totalSalesAmount - totalPaymentsAmount;

  return {
    pageOrientation: 'landscape',
    header: headerSection({
      title: 'DETALLE DE SALDO DE CLIENTE',
      subTitle: 'PAISA BOMBAS',
      showLogo: true,
      showDate: true,
    }),
    footer: footerSection,
    pageMargins: [50, 150, 50, 60],
    content: [
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
                text: `${fullName}`,
              },
            ],
            [
              {
                text: 'NIT: ',
                bold: true,
              },
              {
                text: `${nit}`,
              },
            ],
            [
              {
                text: 'Email: ',
                bold: true,
              },
              {
                text: `${email}`,
              },
            ],
            [
              {
                text: 'Teléfono: ',
                bold: true,
                margin: [0, 0, 0, 15],
              },
              {
                text: `${phone}`,
              },
            ],
          ],
        },
      },
      {
        layout: 'customDetailLayout',
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', '*', 80, 80, '*', 80],
          body: [...header, ...content],
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
                text: `Q. ${formatAmount(totalAmount)}`,
              },
            ],
          ],
        },
      },
    ],
  };
};
