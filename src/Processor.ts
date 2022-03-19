import {UserData} from "./UserData";

export abstract class Processor {
    public abstract execute(data: UserData): Promise<any>;
    public abstract getEntryPoint(): string;
}