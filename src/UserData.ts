export interface UserData {
    id: number;
    username: string,
    url: string,
    avatar: {
        url: string
    },
    messages: UserDataMessage[]
}

export interface UserDataMessage {
    date: Date;
    html: string;
    text: string;
    signature: string;
    topic: {
        id: number;
        title: string;
        url: string;
    }
}

export interface UserDataIndex {
    [id: number]: UserData;
}