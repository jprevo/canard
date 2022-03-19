import * as fs from "fs";
import {Stats} from "fs";
import * as cheerio from 'cheerio';
import {UserData, UserDataIndex} from "./UserData";
import moment from "moment";

const dataDir: string = "./data/html";
const files: string[] = [];

const userIndex: UserDataIndex = {};

const topicsDirs: string[] = fs.readdirSync(dataDir);

// Extract data filenames
for (let topicDir of topicsDirs) {
    const fullPath: string = dataDir + "/" + topicDir;
    const stat: Stats = fs.statSync(fullPath);

    if (!stat.isDirectory()) {
        continue;
    }

    const topicFiles: string[] = fs.readdirSync(fullPath);

    for (let topicFile of topicFiles) {
        const fullPath: string = dataDir + "/" + topicDir + "/" + topicFile;
        const stat: Stats = fs.statSync(fullPath);

        if (!stat.isFile()) {
            continue;
        }

        const ext: string = fullPath.split('.').pop();

        if (ext !== "html") {
            continue;
        }

        files.push(fullPath);
    }
}

let n: number = 0;

for (let file of files) {
    const html: string = fs.readFileSync(file, "utf8");
    const $ = cheerio.load(html);

    const $title: any = $(".pagetitle .threadtitle");
    const topicTitle: string = $title.find("a").text();
    const topicUrl: string = $title.find("a").attr('href');
    const topicId: number = parseInt(topicUrl.match(/\d+/)[0], 10);

    $("body").find('.postcontainer').each((index: number, post: any) => {
        const $container: any = $(post);
        const $userContainer: any = $container.find('.username_container');

        const userUrl: string = $userContainer.find('.username').attr('href');

        if (!userUrl) {
            return; // user is guest, do not index
        }

        const id: number = parseInt(userUrl.match(/\d+/)[0], 10);
        const username: string = $userContainer.find('.username').text();
        const avatarUrl: string = $container.find('.postuseravatar img').attr('src');

        let user: UserData;

        if (userIndex[id]) {
            user = userIndex[id];
        } else {
            user = {
                id: id,
                username: username,
                url: userUrl,
                avatar: {
                    url: avatarUrl
                },
                messages: []
            };

            userIndex[id] = user;
        }

        const dateStr = $container.find('.postdate .date').text();
        const contentHtml: string = $container.find('.postcontent').html();
        const contentText: string = $container.find('.postcontent').text();
        const signature: string = $container.find('.signaturecontainer').html();

        const date: Date = moment(dateStr.replace('h', ':'), "DD/MM/YYYY, HH:mm").toDate();

        user.messages.push({
            date: date,
            html: contentHtml,
            text: contentText,
            signature: signature,
            topic: {
                title: topicTitle,
                url: topicUrl,
                id: topicId
            }
        })
    });

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write((++n).toString(10) + "/" + files.length.toString(10));
}

fs.writeFileSync("./data/index.json", JSON.stringify(userIndex));