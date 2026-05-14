import os
import re

def replace_classes(content):
    # Colors
    content = content.replace('bg-[#0f0f0f]', 'bg-gray-50 dark:bg-[#0f0f0f]')
    content = content.replace('bg-[#111111]', 'bg-white dark:bg-[#111111]')
    content = content.replace('text-white', 'text-zinc-900 dark:text-white')
    content = content.replace('text-white/60', 'text-zinc-500 dark:text-white/60')
    content = content.replace('text-white/40', 'text-zinc-400 dark:text-white/40')
    content = content.replace('text-white/80', 'text-zinc-700 dark:text-white/80')
    content = content.replace('text-white/70', 'text-zinc-600 dark:text-white/70')
    content = content.replace('text-white/50', 'text-zinc-500 dark:text-white/50')
    content = content.replace('text-white/20', 'text-zinc-300 dark:text-white/20')
    
    # Borders
    content = content.replace('border-white/10', 'border-zinc-200 dark:border-white/10')
    content = content.replace('border-white/20', 'border-zinc-300 dark:border-white/20')
    content = content.replace('border-white/5', 'border-zinc-100 dark:border-white/5')
    
    # Backgrounds
    content = content.replace('bg-white/5', 'bg-black/5 dark:bg-white/5')
    content = content.replace('bg-white/10', 'bg-black/10 dark:bg-white/10')
    content = content.replace('bg-black', 'bg-white dark:bg-black')
    content = content.replace('bg-zinc-900', 'bg-white dark:bg-zinc-900')
    content = content.replace('bg-zinc-800', 'bg-zinc-100 dark:bg-zinc-800')
    
    # Avoid duplicating if already present
    content = content.replace('text-zinc-900 dark:text-zinc-900 dark:text-white', 'text-zinc-900 dark:text-white')
    # ... any other obvious bugs?
    # What about text-white inside buttons?
    # e.g., bg-amber-400 text-black -> text-black is fine.
    # What about images overlay where text-white should remain text-white?
    # "text-white" in an absolute div over an image.
    
    return content

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        if 'admin' in root or 'components' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = replace_classes(content)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Processed {filepath}")

# Process specific folders
process_directory('c:/Users/pc/Desktop/Elevate_Agape/frontend/src/app/pages/public')
process_directory('c:/Users/pc/Desktop/Elevate_Agape/frontend/src/app/pages/home')
process_directory('c:/Users/pc/Desktop/Elevate_Agape/frontend/src/app/layouts/main-layout')
