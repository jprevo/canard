# canard
Analyse des posts du forum canard PC

# Installation

Installer l'environnement python dans script/ comme décrit ici : https://huggingface.co/docs/transformers/installation. Les tests ont été réalisés avec Python 3.9 et TensorFlow 2.0 CPU. Ensuite installer sentencepiece.

```
cd script
python -m venv .env
source .env/bin/activate
pip install transformers
pip install transformers[tf-cpu]
pip install transformers[sentencepiece]
```

# Analyse de sentiment

> Théophile Blard, French sentiment analysis with BERT, (2020), GitHub repository, https://github.com/TheophileBlard/french-sentiment-analysis-with-bert