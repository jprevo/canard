import {UserData, UserDataIndex} from "./UserData";
import * as fs from "fs";
import {Processor} from "./Processor";
import {Sentiment} from "./Processor/Sentiment";
import {Infos} from "./Processor/Infos";
import {MessageStats} from "./Processor/MessageStats";
import {Smiley} from "./Processor/Smiley";
import {Avatar} from "./Processor/Avatar";

export class Analysis {
    protected data: UserDataIndex;
    protected processors: Processor[] = [];

    public load() {
        this.data = JSON.parse(fs.readFileSync("./data/index.json", "utf8"));

        this.processors = [
            new Sentiment(),
            new Avatar(),
            new Infos(),
            new MessageStats(),
            new Smiley(),
        ]
    }

    public run(id: number): Promise<any> {
        if (!this.data[id]) {
            throw "Data not found";
        }

        const result: any = {};
        const userData: UserData = this.data[id];
        const promises: Promise<any>[] = [];

        for (let processor of this.processors) {
            promises.push(
                processor.execute(userData)
                    .then((processorResult: any) => {
                        result[processor.getEntryPoint()] = processorResult;
                        console.log(`Processor ${processor.getEntryPoint()} done`);
                    })
            );
        }

        return Promise.all(promises)
            .then(() => {
                return result;
            })
    }

    public runAll() {

    }
}