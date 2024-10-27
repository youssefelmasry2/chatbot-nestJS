// whatsapp.controller.ts
import { BadRequestException, Body, Controller, Get, HttpCode, Logger, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
    private readonly logger = new Logger(WhatsappController.name);

    constructor(private whatsappService: WhatsappService) {}

    @Get('webhook')
    whatsappVerificationChallenge(@Req() request: Request) {
        const mode = request.query['hub.mode'];
        const challenge = request.query['hub.challenge'];
        const token = request.query['hub.verify_token'];

        const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

        if (!mode || !token) {
            return 'Error in verification token'; 
        }

        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            this.logger.log('WEBHOOK_VERIFIED');
            return challenge?.toString();
        }
    }

    @Post('webhook')
    @HttpCode(200)
    async handleIncomingMessages(@Body() request: any) {
        const { messages } = request?.entry?.[0]?.changes?.[0]?.value ?? {};
        if (!messages) return { message: 'No messages found' };

        const message = messages[0];
        const messageSender = message.from;

        if (message.type === 'text') {
            const text = message.text.body;

            try {
                const response = await this.whatsappService.sendMessageToWhatsapp(messageSender, "message from masry bot");
                return { message: response }; // Return success response
            } catch (error) {
                throw new BadRequestException('Error in sending message');
            }
        }
    }
}
