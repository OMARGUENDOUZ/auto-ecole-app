# Guide Multilingue (Français & Arabe)

Votre application supporte maintenant le français et l'arabe ! Voici comment utiliser les traductions.

## Structure

- `messages/fr.json` - Traductions en français
- `messages/ar.json` - Traductions en arabe
- `src/i18n.ts` - Configuration i18n
- `src/routing.ts` - Configuration des langues
- `middleware.ts` - Middleware de détection de langue

## Utilisation dans les composants

### Client Components

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('candidats');
  
  return <h1>{t('title')}</h1>;
}
```

### Navigation

Utilisez le composant `Link` depuis `@/src/navigation`:

```tsx
import { Link } from '@/src/navigation';

export function Navigation() {
  return <Link href="/candidats">Candidats</Link>;
}
```

## Changement de langue

Utilisez le composant `LanguageSwitcher`:

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function Header() {
  return <LanguageSwitcher />;
}
```

## Ajouter une traduction

1. Ouvrez `messages/fr.json` et `messages/ar.json`
2. Ajoutez la clé et sa valeur:
   ```json
   {
     "myFeature": {
       "label": "Ma fonctionnalité"
     }
   }
   ```
3. Utilisez dans le composant:
   ```tsx
   const t = useTranslations('myFeature');
   t('label') // "Ma fonctionnalité"
   ```

## Direction RTL

L'arabe utilise la direction RTL (droite à gauche). Cela est configuré automatiquement dans le layout:

```tsx
html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}
```

## URLs

- Français: `/fr/candidats`
- Arabe: `/ar/candidats`

La langue par défaut est le français (`/fr`).

## Styles RTL

Pour les styles personnalisés en RTL:

```tsx
<div className="...
  ltr:ml-4 rtl:mr-4
  ltr:text-left rtl:text-right
">
```

Ou utilisez Tailwind CSS avec les prefix `ltr:` et `rtl:`.
