import {Analysis} from "./Analysis";

const id: number = parseInt(process.argv.splice(2)[0], 10);

const analyser: Analysis = new Analysis();
analyser.load();

analyser.run(id)
    .then((result: any) => {
        console.log(result);
    })
    .catch((e) => {
        console.error(e);
    })