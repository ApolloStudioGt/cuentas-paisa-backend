import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { footerSection, headerSection } from "../sections";
import { AccountCutOff, Customer } from "@prisma/client";

import { DateFormatter } from "../helpers";

interface ReportOptions {
    customerBalance: (AccountCutOff & {customer: Customer})[];
}

export const getCustomerBalanceReport = (options: ReportOptions): TDocumentDefinitions => {

    const { customerBalance } = options;

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
            title: 'CUENTAS POR COBRAR',
            subTitle: 'PAISA BOMBAS',
            showLogo: true,
            showDate: true,
        }),
        footer: footerSection,
        pageMargins: [ 50, 150, 50, 60 ],
        content: [
            {
                layout: 'customLayout',
                table: {
                    headerRows: 1,
                    widths: ['*', 150, 150],
                    body: [
                        [
                            {
                                text: 'CLIENTE',
                                bold: true,
                            },
                            {
                                text: 'SALDO PENDIENTE',
                                bold: true,
                            },
                            {
                                text: 'FECHA DE CORTE',
                                bold: true,
                            }
                        ],
                        ...customerBalance.map((balance) => {
                            totalAmount += balance.amount;
                            return [
                                { text: balance.customer.fullName, bold: true },
                                { text: `Q. ${formatAmount(balance.amount).toString()}`},
                                { text: DateFormatter.getDDMMMMYYYY(balance.updatedAt)},
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
                text: 'TOTAL',
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
                                text: `Saldo por cobrar: Q. ${formatAmount(totalAmount)}`,
                                bold: true,
                            },
                        ],
                    ],
                },
            },
        ],
    };
};