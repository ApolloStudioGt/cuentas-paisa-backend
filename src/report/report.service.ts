import { Injectable } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { getCustomerBalanceReport } from './definitions';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ReportService{
    constructor(
        private readonly printerService: PrinterService,
        private readonly prismaService: PrismaService) {
    }

    async allCustomerBalance() {
        const customerBalance = await this.prismaService.accountCutOff.findMany({
            where: {
                isActive: true,
            },
            include: {
                customer: true,
            },
            orderBy: {
                customer: {
                    fullName: 'asc',
                },
            },
        });

        const docDefinition = getCustomerBalanceReport({customerBalance: customerBalance});
        return this.printerService.createPdf(docDefinition);
    }
}
