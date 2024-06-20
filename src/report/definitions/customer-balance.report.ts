import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { footerSection, headerSection } from "../sections";
import { AccountCutOff, Customer } from "@prisma/client";

import { DateFormatter } from "../helpers";

interface ReportOptions {
    title?: string;
    subTitle?: string;
    customerBalance: (AccountCutOff & {customer: Customer})[];
}

export const getCustomerBalanceReport = (options: ReportOptions): TDocumentDefinitions => {

    const { title, subTitle, customerBalance } = options;

    let totalAmount = 0;

    const formatAmount = (amount: number): string => {
        return amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    return {
        pageOrientation: 'landscape',
        header: headerSection({
            title: title ?? 'Cuentas Por Cobrar',
            subTitle: subTitle ?? 'PAISA BOMBAS',
            showLogo: true,
            showDate: true,
        }),
        footer: footerSection,
        pageMargins: [ 50, 200, 50, 60 ],
        content: [
            {
                layout: 'customLayout',
                table: {
                    headerRows: 1,
                    widths: ['*', 150, 150],
                    body: [
                        [
                            {
                                text: 'Cliente',
                                bold: true,
                            },
                            {
                                text: 'Saldo Pendiente',
                                bold: true,
                            },
                            {
                                text: 'Fecha',
                                bold: true,
                            }
                        ],
                        ...customerBalance.map((balance) => {
                            totalAmount += balance.amount;
                            return [
                                { text: balance.customer.fullName, bold: true },
                                { text: `Q. ${formatAmount(balance.amount).toString()}`},
                                { text: DateFormatter.getDDMMMMYYYY(balance.createdAt)},
                            ]
                        }),              
                    ],
                },
            },
            {
                text: '',
                margin: [ 0, 15 ],
            },        
            {
                text: 'Totales',
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
                    body: [
                        [
                            {
                                text: 'Total saldo por cobrar',
                                bold: true,
                            },
                            {
                                text: `Q. ${formatAmount(totalAmount)}`,
                                bold: true
                            }
                        ]
                    ],
                },
            },
        ],
    };
};