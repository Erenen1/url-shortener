#!/bin/bash

# Proje dizinine git
cd /home/eren/Desktop/urlShortener/dashboard


# Tüm değişiklikleri listele
changed_files=$(git status -s | awk '{print $2}')

# Her dosya için ayrı commit at
for file in $changed_files; do
    # Dosya türüne göre anlamlı commit mesajları oluştur
    case "$file" in
        *package.json)
            commit_message="📦 Bağımlılıkları güncelle: Proje bağımlılıklarını düzenle"
            ;;
        *analytics.types.ts)
            commit_message="🔍 Analitik tipleri yeniden düzenle: Zod bağımlılığını kaldır"
            ;;
        *tsconfig.json)
            commit_message="⚙️ TypeScript yapılandırmasını güncelle"
            ;;
        *.tsx)
            commit_message="✨ UI bileşenini geliştir: ${file} dosyasında iyileştirmeler"
            ;;
        *.ts)
            commit_message="🛠️ Servis veya yardımcı fonksiyonları güncelle: ${file}"
            ;;
        *index.ts)
            commit_message="📂 Modül indeksini güncelle: ${file}"
            ;;
        *)
            commit_message="🔧 Genel güncelleme: ${file}"
            ;;
    esac

    # Dosyayı staging area'ya ekle
    git add "$file"
    
    # Commit at
    git commit -m "$commit_message"
    
    echo "✅ ${file} için commit atıldı: $commit_message"
done

# Tüm commitleri göster
git log --oneline -n 5

echo "🎉 Tüm değişiklikler commit edildi!"