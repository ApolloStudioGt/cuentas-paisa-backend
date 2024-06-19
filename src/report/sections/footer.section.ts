import { Content } from "pdfmake/interfaces";


export const footerSection = (currentPage: number, pageCount: number): Content => {
    return {
        text: `Página ${ currentPage } de ${ pageCount }`,
        alignment: 'right',
        fontSize: 12,
        bold: true,
        margin: [0, 10, 35, 0]
    };
};