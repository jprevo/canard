from transformers import ViTFeatureExtractor, ViTForImageClassification
from PIL import Image
import sys

filename = sys.argv[1]
image = Image.open(filename)

feature_extractor = ViTFeatureExtractor.from_pretrained('google/vit-base-patch16-224')
model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')

inputs = feature_extractor(images=image, return_tensors="pt")
outputs = model(**inputs)
logits = outputs.logits

predicted_class_idx = logits.argmax(-1).item()
print(model.config.id2label[predicted_class_idx])