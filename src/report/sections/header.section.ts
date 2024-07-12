import { Content } from 'pdfmake/interfaces';
import { DateFormatter } from '../helpers';

const logo: Content = {
  image: './src/assets/images/paisa-bombas-04.png',
  width: 168,
  height: 50,
  alignment: 'center',
  margin: [0, 15, 0, 30],
};

const currentDate: Content = {
  text: DateFormatter.getDDMMMMYYYY(new Date()),
  alignment: 'right',
  margin: [20, 30],
  width: 150,
  bold: true,
};

interface HeaderOptions {
  title?: string;
  subTitle?: string;
  showLogo?: boolean;
  showDate?: boolean;
}

export const headerSection = (options: HeaderOptions): Content => {
  const { title, subTitle, showLogo, showDate } = options;
  const headerLogo: Content = showLogo ? logo : null;
  const headerDate: Content = showDate ? currentDate : null;

  const headerSubTitle: Content = subTitle
    ? {
        text: subTitle,
        alignment: 'center',
        margin: [0, 2, 0, 0],
        style: {
          fontSize: 17,
          bold: true,
        },
      }
    : null;

  const headerTitle: Content = title
    ? {
        stack: [
          {
            text: title,
            alignment: 'center',
            margin: [0, 15, 0, 0],
            style: {
              bold: true,
              fontSize: 20,
            },
          },
          headerSubTitle,
        ],
      }
    : null;

  return {
    margin: [50, 35, 30, 10],
    columns: [headerLogo, headerTitle, headerDate],
  };
};
