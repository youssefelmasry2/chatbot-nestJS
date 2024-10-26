import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('whatsapp')
export class WhatsappController {

    @Get('webhook')
    whatsappVerificationChallenge(@Req() request: Request) {
        const mode = request.query['hub.mode'];
        const challenge= request.query['hub.challenge'];
        const token = request.query['hub.verify_token'];

        const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

        if(!mode || !token) {
            return 'Error in verification token'; 
        }

        if(mode ==='subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            return challenge?.toString();

        }
        
    }
    
   
    
}
