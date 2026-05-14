import os

def fix_classes(content):
    content = content.replace('dark:text-zinc-500 dark:text-white/60', 'dark:text-white/60')
    content = content.replace('dark:text-zinc-400 dark:text-white/40', 'dark:text-white/40')
    content = content.replace('dark:text-zinc-700 dark:text-white/80', 'dark:text-white/80')
    content = content.replace('dark:text-zinc-600 dark:text-white/70', 'dark:text-white/70')
    content = content.replace('dark:text-zinc-500 dark:text-white/50', 'dark:text-white/50')
    content = content.replace('dark:text-zinc-300 dark:text-white/20', 'dark:text-white/20')
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
                
                new_content = fix_classes(content)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed {filepath}")

process_directory('c:/Users/pc/Desktop/Elevate_Agape/frontend/src/app/pages/public')
process_directory('c:/Users/pc/Desktop/Elevate_Agape/frontend/src/app/pages/home')
process_directory('c:/Users/pc/Desktop/Elevate_Agape/frontend/src/app/layouts/main-layout')
