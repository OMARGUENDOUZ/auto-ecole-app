# 🚗 Auto-École Manager - Frontend

Application de gestion complète pour auto-écoles développée avec Next.js 15, TypeScript et Tailwind CSS.

## ✨ Fonctionnalités

### 📊 Dashboard
- Vue d'ensemble des statistiques clés (total candidats, taux de réussite, examens à venir)
- Widgets KPI interactifs
- Activité récente et notifications

### 👥 Gestion Candidats
- **Liste complète** avec filtres avancés (nom, téléphone, statut, permis)
- **Fiches détaillées** avec photo, progression et historique
- **Inscription** avec auto-génération numéro école (ECO-YYYY-###)
- **Champs doubles inscription** : École + Gouvernement
- **Upload photo** en Base64 pour mode offline
- **Export CSV** pour reporting

### 📅 Planning Examens
- **Calendrier mensuel** avec vue visuelle
- **Programmation batch** pour plusieurs candidats
- **Filtres** par statut, catégorie (Code/Conduite)
- **Drag & drop** pour réorganiser (à venir)

### 🎯 Candidats Prioritaires
- Page dédiée aux candidats "Prêts pour Examen"
- Sélection multiple pour programmation groupée
- Actions rapides

### 📈 Rapports & Statistiques
- Taux de réussite global
- Statistiques par permis
- Export de données

## 🛠️ Stack Technique

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Components** : shadcn/ui
- **Icons** : Lucide React
- **Forms** : React Hook Form + Zod
- **API Client** : Axios + TanStack Query (React Query)
- **State** : Zustand
- **Toasts** : Sonner
- **Calendar** : react-big-calendar, date-fns

## 📦 Installation

### Prérequis
- Node.js 18+ et npm/yarn/pnpm
- Backend Java Spring Boot en cours d'exécution sur `http://localhost:8080`

### Étapes

