from transformers import AutoModelForSequenceClassification, AutoTokenizer
nli_model = AutoModelForSequenceClassification.from_pretrained('facebook/bart-large-mnli')
tokenizer = AutoTokenizer.from_pretrained('facebook/bart-large-mnli')

label = "jeu video"
premise = "BMDJ : Enfin rentrée de 3 semaines de déplacement pro. C'était plutôt cool, on s'est bien marrés avec les collègues, le début de formation de mon nouveau binôme se passe bien, j'ai pu en profiter pour déminer 2 ou 3 situations chiantes que j'arrive pas à gérer depuis trop longtemps (grmblblbl la gestion de gens je vous jure...). J'ai aussi pu aborder un sujet un peu délicat pour moi avec un collègue, qui du coup a accepté de me coacher sur ce sujet. Par contre dormir loin de chez moi pendant aussi longtemps, avoir 10 fois trop de demandes à gérer chaque jour, me faire pourrir pour une bricole alors que je suis la seule à me sortir les doigts pour gérer certains sujets chiants... je suis bien contente d'être de retour dans ma grotte."
hypothesis = f'Ce sujet est {label}.'

# run through model pre-trained on MNLI
x = tokenizer.encode(premise, hypothesis, return_tensors='pt',
                     truncation_strategy='only_first')
logits = nli_model(x.to(device = 0))[0]

# we throw away "neutral" (dim 1) and take the probability of
# "entailment" (2) as the probability of the label being true
entail_contradiction_logits = logits[:,[0,2]]
probs = entail_contradiction_logits.softmax(dim=1)
prob_label_is_true = probs[:,1]