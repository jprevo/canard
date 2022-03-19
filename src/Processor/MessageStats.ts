import {Processor} from "../Processor";
import {UserData} from "../UserData";

export class MessageStats extends Processor {
    public execute(data: UserData): Promise<any> {
        let result: any = {
            sentence: 0,
            exclamation: 0,
            question: 0,
            dot: 0,
            quote: 0,
            image: 0,
            video: 0,
            link: 0
        };

        for (let message of data.messages) {
            let sentences: string[] = message.text.split(/(?<=[.!?\n])/);
            let excl: string[] = message.text.split('!');
            let ques: string[] = message.text.split('?');
            let dot: string[] = message.text.split('.');
            let quote: string[] = message.html.split('quote_container');
            let img: string[] = message.html.split('NcodeImageResizer');
            let video: string[] = message.html.split('www.youtube.com/embed');
            let link: string[] = message.html.split('a href="');

            for (let sentence of sentences) {
                sentence = sentence.trim();

                if (sentence) {
                    result.sentence++;
                }
            }
            result.exclamation += excl.length - 1;
            result.question += ques.length - 1;
            result.quote += quote.length - 1;
            result.image += img.length - 1;
            result.dot += dot.length - 1;
            result.video += video.length - 1;
            result.link += link.length - 1;
        }

        return Promise.resolve(result);
    }

    public getEntryPoint(): string {
        return "messages";
    }
}