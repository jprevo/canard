import {Processor} from "../Processor";
import {UserData} from "../UserData";
import * as cheerio from 'cheerio';

export class Smiley extends Processor {
    public execute(data: UserData): Promise<any> {
        const result: any = {};
        let total: number = 0;

        for (let message of data.messages) {
            const $: any = cheerio.load(message.html);

            $("body").find('img.inlineimg').each((index: number, smiley: any) => {
                const $smiley: any = $(smiley);
                const url: string = $smiley.attr('src');

                if (url.indexOf('smilies') < 0) {
                    return;
                }

                total++;

                if (!result[url]) {
                    result[url] = {
                        count: 0,
                        percent: 0
                    };
                }

                result[url].count++;
            })
        }

        for (let url in result) {
            result[url].percent = (result[url].count / total) * 100;
        }

        return Promise.resolve(result);
    }

    public getEntryPoint(): string {
        return "smiley";
    }
}