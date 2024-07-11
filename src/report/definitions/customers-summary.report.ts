import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { GetCustomerDebt, Sale, Payment } from 'src/customer/interfaces/get-customer-debt';
import { DateFormatter } from '../helpers';
import { headerSection, footerSection } from '../sections';

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

        const salesAndPayments = customer.sales.flatMap((sale: Sale) => {
            totalSalesAmount += sale.amount;

            const saleRow = [
                DateFormatter.getDDMMYYYY(sale.createdAt),
                sale.docReference,
                `Q. ${formatAmount(sale.amount)}`,
                '',
                '',
                '',
                '',
                '',
                `Q. ${formatAmount(customer.currentDebt)}`,
            ];

            const paymentRows = sale.payments.map((payment: Payment) => {
                totalPaymentsAmount += payment.amount;
                return [
                    '',
                    '',
                    '',
                    payment.docReference,
                    payment.docAuthorization,
                    DateFormatter.getDDMMYYYY(payment.createdAt),
                    payment.bankDescription,
                    `Q. ${formatAmount(payment.amount)}`,
                    `Q. ${formatAmount(customer.currentDebt - totalPaymentsAmount)}`,
                ];
            });

            return [saleRow, ...paymentRows];
        });

        const totalAmount = totalSalesAmount - totalPaymentsAmount;

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
                    widths: ['auto', 'auto', 80, 'auto', '*', 80, '*', 80, 80],
                    body: [
                        ['Fecha', 'Documento', 'Monto Venta', 'Recibo Pago', 'No. Depósito', 'Fecha Pago', 'Banco', 'Monto Pago', 'Saldo'],
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
                    ]
                }
            }
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
