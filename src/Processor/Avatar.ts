import {Processor} from "../Processor";
import {UserData} from "../UserData";
import * as fs from "fs";
import * as http from "http";
const { exec } = require('child_process');

export class Avatar extends Processor {
    public async execute(data: UserData): Promise<any> {
        const url: string = "http://forum.canardpc.com/" + data.avatar.url;
        const imgName: string = data.avatar.url.split('/').pop();
        const avatarPath: string = './data/avatar/' + imgName;
        const scriptAvatarPath: string = './../data/avatar/' + imgName;

        if (!fs.existsSync(avatarPath)) {
            await this.download(url, avatarPath);
        }

        return new Promise<any>((resolve: Function, reject: Function) => {
            exec("cd ./script && . .env/bin/activate && python3.9 avatar.py " + scriptAvatarPath, (err: string, out: string, stderr: string) => {
                if (err) {
                    console.error(stderr);
                    console.error(err);
                    return reject("An error occurred during avatar analysis");
                }

                return resolve({
                    topic: out
                });
            });
        });
    }

    protected download(url: string, dest: string): Promise<string> {
        const file = fs.createWriteStream(dest);

        return new Promise<string>((resolve: Function, reject: Function) => {
            http.get(url, function(response: any) {
                response.pipe(file);

                file.on('finish', function() {
                    file.close(() => {
                        return resolve(dest);
                    });
                });
            });
        });
    }

    public getEntryPoint(): string {
        return "avatar";
    }
}