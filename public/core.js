const SearchResultCount = 10;

class Core {
    ducks;
    templating;

    constructor() {
        document.addEventListener("DOMContentLoaded", () => {
            this.init();
        });
    }

    init() {
        this.initTemplating();
        this.initSearch();

        this.display(16662);
    }

    initTemplating() {
        this.templating = new Templating();
    }

    initSearch() {
        const form = document.getElementById('search-form');

        form.addEventListener("submit", (e) => {
            e.preventDefault();
        });

        fetch("ducks.json")
            .then(response => response.json())
            .then((ducks) => {
                this.ducks = ducks;
            })
            .then(() => {
                const input = form.querySelector('input[type=search]');

                input.addEventListener('keyup', (e) => {
                    this.search(input.value);
                })
            })
    }

    clearSearchResult() {
        document.getElementById('search-result').innerHTML = '';
    }

    search(q) {
        const result = document.getElementById('search-result');

        q = q.trim();
        q = q.toLowerCase();

        if (!q) {
            return this.clearSearchResult();
        }

        const found = [];

        let n = 0;

        for (let duck of this.ducks) {
            if (duck.username.toLowerCase().indexOf(q) >= 0) {
                found.push(duck);

                if (++n >= SearchResultCount) {
                    break;
                }
            }
        }

        if (!found.length) {
            return this.clearSearchResult();
        }

        result.innerHTML = this.templating.render('search-result', {
            ducks: found
        });

        result.querySelectorAll('.list-group-item').forEach((entry) => {
            entry.addEventListener('click', (e) => {
                this.clearSearchResult()
                this.display(entry.dataset.id);
            });
        })
    }

    display(id) {
        fetch("./ducks/" + id.toString() + ".json")
            .then(response => response.json())
            .then((data) => {
                return new Duck(data, this.templating);
            })
            .then((duck) => {
                duck.render();
            })
    }
}

class Templating {
    constructor() {
        nunjucks.configure({ autoescape: true });
    }

    render(id, vars) {
        const njk = document.getElementById('tpl-' + id).innerHTML;

        return nunjucks.renderString(njk, vars);
    }
}

class Duck {
    data;
    templating;

    constructor(data, templating) {
        this.data = data;
        this.templating = templating;

        console.log(this.data);
    }

    render() {
        const container = document.getElementById('content');
        const infos = this.templating.render('userinfos', { duck: this.data });
        const messages = this.templating.render('messages', { duck: this.data });
        const sentiment = this.templating.render('sentiment', { duck: this.data });
        const smiley = this.templating.render('smiley', { smileys: this.parseSmileys() });

        const html = this.templating.render('layout', {
            infos: infos,
            messages: messages,
            sentiment: sentiment,
            smiley: smiley
        });

        container.innerHTML = html;

        this.initSentiment();
    }

    parseSmileys() {
        const smileys = [];

        for (let url in this.data.smiley) {
            const percent = this.data.smiley[url].percent;

            smileys.push({
                url: url,
                count: this.data.smiley[url].count,
                percent: Math.round(percent * 100) / 100
            })
        }

        smileys.sort((a, b) => {
            return a.count > b.count ? -1 : 1;
        });

        let maxPercent = smileys[0].percent;
        let ratio = 100 / maxPercent;
        let minOpacity = 35;

        for (let smiley of smileys) {
            smiley.opacity = smiley.percent * ratio + minOpacity;
        }

        return smileys;
    }

    initSentiment() {
        const data = {
            labels: ['Neutre', 'Positif', 'Negatif'],
            series: [
                this.data.sentiment.neutral, this.data.sentiment.positive, this.data.sentiment.negative
            ]
        }

        new Chartist.Pie('#sentiment-chart', data, {
            width: 250,
            height: 250
        });
    }
}

window.core = new Core();
