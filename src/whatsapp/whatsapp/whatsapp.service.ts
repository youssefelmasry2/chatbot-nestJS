// whatsapp.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WhatsappService {
    private readonly logger = new Logger(WhatsappService.name);

    constructor(private httpService: HttpService) {}

    async sendMessageToWhatsapp(messageSender: string, messageText: string): Promise<string> {
        const url = `https://graph.facebook.com/${process.env.WHATSAPP_CLOUD_API_VERSION}/${process.env.WHATSAPP_CLOUD_API_PHONE_NUMBER_ID}/messages`;
        const config = {
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${process.env.WHATSAPP_CLOUD_API_ACCES_TOKEN}`
            },
        };
        const data = {
            messaging_product: "whatsapp",    
            recipient_type: "individual",
            to: messageSender,
            type: "text",
            text: {
                preview_url: false,
                body: messageText
            }
        };

        try {
            const response = await lastValueFrom(this.httpService.post(url, data, config));
            this.logger.log(`Message sent: ${response.data}`);
            return 'Message sent successfully';
        } catch (error) {
            this.logger.error(`Error in sending message: ${error.message}`);
            throw new BadRequestException('Error in sending message');
        }
    }
}

