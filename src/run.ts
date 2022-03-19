import {Analysis} from "./Analysis";
import * as fs from "fs";

const id: number = parseInt(process.argv.splice(2)[0], 10);

const analyser: Analysis = new Analysis();
analyser.load();

const ducks: any[] = JSON.parse(fs.readFileSync("./public/ducks.json", "utf8"));

analyser.run(id)
    .then((result: any) => {
        const fileName: string = "./public/ducks/" + id.toString(10) + ".json";
        fs.writeFileSync(fileName, JSON.stringify(result, null, 2));

        console.log(`Data wrote to ${fileName}`);

        return result;
    })
    .then((result: any) => {
        for (let duck of ducks) {
            if (duck.id == id) {
                // Duck found, do nothing
                return;
            }
        }

        const duckIndex: any = {
            id: id,
            username: result.infos.username
        }

        ducks.push(duckIndex);

        fs.writeFileSync("./public/ducks.json", JSON.stringify(ducks, null, 2));

        console.log(`Index updated`);
    })
    .catch((e) => {
        console.error(e);
    })