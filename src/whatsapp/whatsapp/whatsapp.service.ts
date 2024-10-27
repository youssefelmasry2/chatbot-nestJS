// whatsapp.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export class WhatsappService {

    constructor(private openaiService: OpenaiService) {}


    private readonly logger = new Logger(WhatsappService.name);

    private readonly httpService = new HttpService();

    async sendMessageToWhatsapp(messageSender: string, userInput: string): Promise<string> {
        const aiResponse = await this.openaiService.generateAIResponse(userInput);
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
                body: aiResponse
            }
        };

        try {
            const response = await lastValueFrom(this.httpService.post(url, data, config));
            this.logger.log(`Message sent: ${response.data}`);
            return 'Message sent successfully';
        } catch (error) {
            this.logger.error(`Error in sending message: ${error}`);
            throw new BadRequestException('Error in sending message');
        }
    }
}

