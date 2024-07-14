import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { CustomerBalanceDetailDto, PaymentDto } from '../dto/detail-customer-balance.dto';
import { DateFormatter } from '../helpers';
import { footerSection, headerSection } from '../sections';

interface ReportOptions {
    fullName: string;
    nit: string;
    email: string;
    phone: string;
    sales: CustomerBalanceDetailDto[];
}

export const getCustomerBalanceDetailReport = (
    options: ReportOptions,
): TDocumentDefinitions => {
    const { fullName, nit, email, phone, sales } = options;

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
                text: 'Documento de Venta',
                bold: true,
                alignment: 'center',
                valign: 'middle',
            },
            {
                text: 'Fecha de Venta',
                bold: true,
                alignment: 'center',
                valign: 'middle',
            },
            {
                text: 'Monto de Venta',
                bold: true,
                alignment: 'center',
                valign: 'middle',
            },
            {
                text: 'Recibo de Pago',
                bold: true,
                alignment: 'center',
                valign: 'middle',
            },
            {
                text: 'No. Depósito',
                bold: true,
                alignment: 'center',
                valign: 'middle',
            },
            {
                text: 'Fecha de Pago',
                bold: true,
                alignment: 'center',
                valign: 'middle',
            },
            {
                text: 'Banco',
                bold: true,
                alignment: 'center',
                valign: 'middle',
            },
            {
                text: 'Monto de Pago',
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

    const content = sales.flatMap((sale) => {
        let currentDebt = sale.amount;

        const saleRow = [
            {
                text: sale.docReference,
                alignment: 'center',
                valign: 'middle',
            },
            {
                text: DateFormatter.getDDMMYYYY(sale.createdAt),
                alignment: 'center',
                valign: 'middle',
            },
            {
                text: `Q. ${formatAmount(sale.amount)}`,
                valign: 'middle',
                bold: true,
            },
            {
                text: '', colSpan: 5
            },
            {},
            {},
            {},
            {},
            {
                text: `Q. ${formatAmount(currentDebt)}`,
                valign: 'middle',
            },
        ];

        totalSalesAmount += sale.amount;

        const paymentRows = sale.payments.map((payment: PaymentDto) => {
            currentDebt -= payment.amount;
            totalPaymentsAmount += payment.amount;

            return [
                {},
                {},
                {},
                {
                    text: payment.docReference,
                    alignment: 'center',
                    valign: 'middle',
                },
                {
                    text: payment.docAuthorization,
                    alignment: 'center',
                    valign: 'middle',
                },
                {
                    text: DateFormatter.getDDMMYYYY(payment.createdAt),
                    alignment: 'center',
                    valign: 'middle',
                },
                {
                    text: payment.bankDescription,
                    alignment: 'center',
                    valign: 'middle',
                },
                {
                    text: `Q. ${formatAmount(payment.amount)}`,
                    valign: 'middle',},
                {
                    text: `Q. ${formatAmount(currentDebt)}`,
                    valign: 'middle',
                },
            ];
        });

        return [saleRow, ...paymentRows];
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
                    widths: ['auto', 'auto', 80, 'auto', '*', 80, '*', 80, 80],
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
                                text: `Q. ${formatAmount(totalSalesAmount)}`
                            },
                        ],
                        [
                            {
                                text: 'Pagos: ',
                                bold: true,
                            },
                            {
                                text: `Q. ${formatAmount(totalPaymentsAmount)}`
                            },
                        ],
                        [
                            {
                                text: 'Pendiente: ',
                                bold: true,
                            },
                            {
                                text: `Q. ${formatAmount(totalAmount)}`,
                            }
                        ],
                    ],
                },
            },
        ],
    };
};