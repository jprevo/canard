import {Processor} from "../Processor";
import {UserData} from "../UserData";
import * as fs from "fs";
const { exec } = require('child_process');

export class Sentiment extends Processor {
    public execute(data: UserData): Promise<any> {
        const fileName: string = './tmp/' + data.id.toString(10) + ".txt";
        const scriptFileName: string = './../tmp/' + data.id.toString(10) + ".txt";

        let allMessages: string = '';

        for (let message of data.messages) {
            let content: string = message.text;
            content = content.trim();

            allMessages += content + " \n\n";
        }

        fs.writeFileSync(fileName, allMessages);

        return new Promise<any>((resolve: Function, reject: Function) => {
            exec("cd ./script && . .env/bin/activate && python3.9 sentiment.py " + scriptFileName, (err: string, out: string, stderr: string) => {
                if (err) {
                    console.error(stderr);
                    console.error(err);
                    return reject("An error occurred during sentiment analysis");
                }

                const posCount = out.match(/\bPOSITIVE\b/g);
                const neuCount = out.match(/\bNEUTRAL\b/g);
                const negCount = out.match(/\bNEGATIVE\b/g);

                fs.unlinkSync(fileName);

                return resolve({
                    positive: posCount ? posCount.length : 0,
                    neutral: neuCount ? neuCount.length : 0,
                    negative: negCount ? negCount.length : 0,
                });
            });
        });
    }

    public getEntryPoint(): string {
        return "sentiment";
    }
}