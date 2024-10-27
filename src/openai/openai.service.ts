import { Injectable, Logger } from '@nestjs/common';
import { OpenAI} from 'openai';

@Injectable()
export class OpenaiService {


    private readonly openai = new OpenAI({baseURL:"http://localhost:11434/v1",apiKey:'nokeyneeded'});

    private readonly logger = new Logger(OpenaiService.name);


    async generateAIResponse(userInput: string){
     try{
        const response = await this.openai.chat.completions.create({
            messages:[{role: 'user', content: userInput}],
            model: 'phi3',
        })
        this.logger.log('response from ai :',response);

        return response.choices[0].message.content;




     }
     catch(err){
        this.logger.error('error fel ai :',err);
         console.log(err);
         return "Error in generating AI response";
     }


    }
}
