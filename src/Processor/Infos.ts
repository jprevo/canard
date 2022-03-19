import {Processor} from "../Processor";
import {UserData} from "../UserData";

export class Infos extends Processor {
    public execute(data: UserData): Promise<any> {
        return Promise.resolve({
            username: data.username,
            id: data.id,
            url: data.url,
            avatar_url: data.avatar.url,
            message_count: data.messages.length
        })
    }

    public getEntryPoint(): string {
        return "infos";
    }
}