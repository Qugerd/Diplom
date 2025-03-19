import re

def get_birds_spicies():
    species_bird = []
    with open('speceis.txt', 'r', encoding='utf-8') as file:
        lines = file.readlines()

        for line in lines:
            cleaned_line = re.sub(r'\d+\.\s*', '', line)
            cleaned_line = re.sub(r'\s*\([^)]*\)', '', cleaned_line)
            species_bird.append(cleaned_line)
    
    return species_bird

